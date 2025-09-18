# File: app/services/translator.py
from deep_translator import GoogleTranslator
from sqlalchemy.orm import Session
from app import models

SUPPORTED_LANGUAGES = {"en": "English", "hi": "Hindi", "mr": "Marathi", "fr": "French", "es": "Spanish", "ta": "Tamil", "te": "Telugu"}

def get_supported_languages():
    return SUPPORTED_LANGUAGES

def translate_description(namaste_code: str, target_lang: str, db: Session):
    if target_lang not in SUPPORTED_LANGUAGES:
        return {"error": "Unsupported language"}
    diagnosis = db.query(models.Diagnosis).filter(models.Diagnosis.namastecode == namaste_code).first()
    if not diagnosis or not diagnosis.description:
        return {"original_text": "", "translated_text": "No description available to translate.", "target_language": target_lang}
    try:
        translated_text = GoogleTranslator(source='auto', target=target_lang).translate(diagnosis.description)
        return {"original_text": diagnosis.description, "translated_text": translated_text, "target_language": target_lang}
    except Exception as e:
        return {"error": str(e)}