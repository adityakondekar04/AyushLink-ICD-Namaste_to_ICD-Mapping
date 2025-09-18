# File: app/services/ai_analyzer.py
from sqlalchemy.orm import Session
import pandas as pd
import spacy
from app import models

try:
    nlp = spacy.load("en_core_web_md")
except OSError:
    print("\n\n!!! spaCy model 'en_core_web_md' not found. !!!")
    print("Please run 'python -m spacy download en_core_web_md' in your terminal.\n\n")
    nlp = None

def find_likely_diagnoses(symptom_text: str, db: Session, top_n: int = 5):
    if nlp is None:
        return [{"error": "spaCy language model not loaded."}]
    
    all_diagnoses_query = db.query(models.Diagnosis.namastecode, models.Diagnosis.term, models.Diagnosis.description, models.Diagnosis.icd11code).all()
    if not all_diagnoses_query: return []

    df = pd.DataFrame(all_diagnoses_query, columns=['code', 'term', 'description', 'icd11code'])
    df['description'] = df['description'].fillna('')
    symptom_doc = nlp(symptom_text)
    
    scores = []
    for index, row in df.iterrows():
        diagnosis_text = f"{row['term']}. {row['description']}"
        if not diagnosis_text.strip(): continue # Skip empty descriptions
        
        diagnosis_doc = nlp(diagnosis_text)
        if not diagnosis_doc.has_vector or not symptom_doc.has_vector: continue # Skip docs without vectors
        
        similarity_score = symptom_doc.similarity(diagnosis_doc)
        if similarity_score > 0.1: # Set a minimum threshold
            scores.append({
                "code": row['code'],
                "description": row['term'],
                "score": float(similarity_score),
                "icd11code": row['icd11code'] or 'N/A'
            })

    if not scores: return []
    sorted_results = sorted(scores, key=lambda k: k['score'], reverse=True)
    return sorted_results[:top_n]