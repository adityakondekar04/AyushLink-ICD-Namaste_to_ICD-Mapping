# File: app/schemas.py
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

# --- Terminology Schemas ---
class DiagnosisBase(BaseModel):
    namastecode: str
    term: Optional[str] = None
    biomedicalequivalent: Optional[str] = None
    description: Optional[str] = None
    icd11code: Optional[str] = None
    imageurl: Optional[str] = None
    formulations: Optional[str] = None
    pathya: Optional[str] = None
    apathya: Optional[str] = None

class Diagnosis(DiagnosisBase):
    model_config = ConfigDict(from_attributes=True)

class DiagnosisSearchResult(BaseModel):
    namastecode: str
    term: Optional[str] = None

# --- AI Schema ---
class SymptomRequest(BaseModel):
    symptoms: str

# --- Translation Schema ---
class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    target_language: str

# --- Updates Schemas ---
class UpdateBase(BaseModel):
    title: str
    content: str
    source_url: Optional[str] = None

class UpdateCreate(UpdateBase):
    pass

class Update(UpdateBase):
    id: int
    created_at: datetime
    author: Optional[str] = "AyushLink News"
    model_config = ConfigDict(from_attributes=True)

# --- Contribution Schemas ---
class ContributionBase(BaseModel):
    namastecode_target: str
    suggestion_type: str
    content: str

class ContributionCreate(ContributionBase):
    pass

class Contribution(ContributionBase):
    id: int
    status: str
    created_at: datetime
    author: Optional[str] = "Anonymous Contributor"
    model_config = ConfigDict(from_attributes=True)

# --- Chat Schemas ---
class ChatMessageBase(BaseModel):
    content: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    author: Optional[str] = "Dr. Ayush"
    created_at: datetime
    user_id: Optional[int] = None
    model_config = ConfigDict(from_attributes=True)

# --- User & Authentication Schemas ---
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    model_config = ConfigDict(from_attributes=True)

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Patient History Schemas ---
class PatientRecordBase(BaseModel):
    symptoms: str
    diagnosis: str
    treatment: str

class PatientRecordCreate(PatientRecordBase):
    pass

class PatientRecord(PatientRecordBase):
    id: int
    record_date: datetime
    model_config = ConfigDict(from_attributes=True)

class PatientBase(BaseModel):
    full_name: str
    date_of_birth: Optional[str] = None
    contact_info: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class Patient(PatientBase):
    id: int
    records: List[PatientRecord] = []
    model_config = ConfigDict(from_attributes=True)