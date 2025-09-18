# File: main.py
from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Dict

from app import models, schemas, security, auth, database
from app.services import ai_analyzer, translator

models.Base.metadata.create_all(bind=database.engine)
app = FastAPI(title="AyushLink API")

app.mount("/static", StaticFiles(directory="static"), name="static")
@app.get("/", response_class=FileResponse, include_in_schema=False)
async def read_index(): return "static/index.html"

# --- AUTHENTICATION ---
@app.post("/token", response_model=schemas.Token, tags=["Authentication"])
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User, tags=["Authentication"])
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, full_name=user.full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/me/", response_model=schemas.User, tags=["Authentication"])
async def read_users_me(current_user: schemas.User = Depends(auth.get_current_active_user)):
    return current_user

@app.put("/users/me/", response_model=schemas.User, tags=["Authentication"])
async def update_user_me(user_update: schemas.UserUpdate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

# --- CLINICAL TOOLS ---
@app.get("/api/v1/terminology/search", response_model=List[schemas.DiagnosisSearchResult], tags=["Clinical Tools"])
def search_terminology(q: str, db: Session = Depends(database.get_db)):
    search_term = f"%{q.lower()}%"
    return db.query(models.Diagnosis).filter(or_(models.Diagnosis.term.ilike(search_term), models.Diagnosis.namastecode.ilike(search_term), models.Diagnosis.icd11code.ilike(search_term))).limit(10).all()

@app.get("/api/v1/diagnosis/{namaste_code}", response_model=schemas.Diagnosis, tags=["Clinical Tools"])
def get_diagnosis_details(namaste_code: str, db: Session = Depends(database.get_db)):
    result = db.query(models.Diagnosis).filter(models.Diagnosis.namastecode == namaste_code).first()
    if not result:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
    return result

@app.post("/api/v1/ai/analyze-symptoms", response_model=List[dict], tags=["Clinical Tools"])
def analyze_symptoms(request: schemas.SymptomRequest, db: Session = Depends(database.get_db)):
    return ai_analyzer.find_likely_diagnoses(symptom_text=request.symptoms, db=db)

# --- TRANSLATION ---
@app.get("/api/v1/translate/languages", response_model=Dict[str, str], tags=["Translation"])
def list_supported_languages():
    return translator.get_supported_languages()

@app.get("/api/v1/translate/{namaste_code}", response_model=schemas.TranslationResponse, tags=["Translation"])
def translate_diagnosis(namaste_code: str, lang: str, db: Session = Depends(database.get_db)):
    result = translator.translate_description(namaste_code, lang, db)
    if result is None: raise HTTPException(status_code=404, detail="Diagnosis not found")
    if result.get("error"): raise HTTPException(status_code=500, detail=result.get("error"))
    return result

# --- COMMUNITY ---
@app.post("/api/v1/updates", response_model=schemas.Update, tags=["Community"])
def create_update(update: schemas.UpdateCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    db_update = models.Update(**update.dict(), author=current_user.full_name)
    db.add(db_update)
    db.commit()
    db.refresh(db_update)
    return db_update

@app.get("/api/v1/updates", response_model=List[schemas.Update], tags=["Community"])
def get_updates(skip: int = 0, limit: int = 20, db: Session = Depends(database.get_db)):
    return db.query(models.Update).order_by(models.Update.created_at.desc()).offset(skip).limit(limit).all()

@app.post("/api/v1/contributions", response_model=schemas.Contribution, tags=["Community"])
def create_contribution(contribution: schemas.ContributionCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    db_contribution = models.Contribution(**contribution.dict(), author=current_user.full_name)
    db.add(db_contribution)
    db.commit()
    db.refresh(db_contribution)
    return db_contribution

@app.get("/api/v1/contributions/all", response_model=List[schemas.Contribution], tags=["Community"])
def get_all_contributions(skip: int = 0, limit: int = 20, db: Session = Depends(database.get_db)):
    return db.query(models.Contribution).order_by(models.Contribution.created_at.desc()).offset(skip).limit(limit).all()

@app.post("/api/v1/chat/messages", response_model=schemas.ChatMessage, tags=["Community"])
def create_chat_message(message: schemas.ChatMessageCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    db_message = models.ChatMessage(content=message.content, author=current_user.full_name, user_id=current_user.id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@app.get("/api/v1/chat/messages", response_model=List[schemas.ChatMessage], tags=["Community"])
def get_chat_messages(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return db.query(models.ChatMessage).order_by(models.ChatMessage.created_at.asc()).offset(skip).limit(limit).all()

@app.delete("/api/v1/chat/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Community"])
def delete_chat_message(message_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    message = db.query(models.ChatMessage).filter(models.ChatMessage.id == message_id).first()
    if not message: raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    if message.user_id != current_user.id: raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    db.delete(message)
    db.commit()
    return

# --- PATIENT HISTORY ---
@app.post("/api/v1/patients", response_model=schemas.Patient, tags=["Patient History"])
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    db_patient = models.Patient(**patient.dict(), doctor_id=current_user.id)
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@app.get("/api/v1/patients", response_model=List[schemas.Patient], tags=["Patient History"])
def get_patients(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    return db.query(models.Patient).filter(models.Patient.doctor_id == current_user.id).order_by(models.Patient.full_name).all()

@app.get("/api/v1/patients/{patient_id}", response_model=schemas.Patient, tags=["Patient History"])
def get_patient_details(patient_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id, models.Patient.doctor_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found or not authorized")
    return patient

@app.post("/api/v1/patients/{patient_id}/records", response_model=schemas.PatientRecord, tags=["Patient History"])
def create_patient_record(patient_id: int, record: schemas.PatientRecordCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_active_user)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id, models.Patient.doctor_id == current_user.id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found or not authorized")
    db_record = models.PatientRecord(**record.dict(), patient_id=patient_id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record