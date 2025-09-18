# File: app/models.py
from sqlalchemy import Column, String, Text, Integer, DateTime, func, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Diagnosis(Base):
    __tablename__ = "diagnoses"
    namastecode = Column(String, primary_key=True, index=True)
    term = Column(String, index=True)
    biomedicalequivalent = Column(String)
    system = Column(String)
    description = Column(Text)
    icd11code = Column(String)
    imageurl = Column(String)
    formulations = Column(Text)
    pathya = Column(Text)
    apathya = Column(Text)

class Update(Base):
    __tablename__ = "updates"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False)
    author = Column(String)
    source_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    author = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))

class Contribution(Base):
    __tablename__ = "contributions"
    id = Column(Integer, primary_key=True, index=True)
    namastecode_target = Column(String, index=True)
    suggestion_type = Column(String)
    content = Column(Text, nullable=False)
    author = Column(String)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    patients = relationship("Patient", back_populates="doctor", cascade="all, delete-orphan")

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True, nullable=False)
    date_of_birth = Column(String)
    contact_info = Column(String)
    doctor_id = Column(Integer, ForeignKey("users.id"))
    doctor = relationship("User", back_populates="patients")
    records = relationship("PatientRecord", back_populates="patient", cascade="all, delete-orphan")

class PatientRecord(Base):
    __tablename__ = "patient_records"
    id = Column(Integer, primary_key=True, index=True)
    record_date = Column(DateTime(timezone=True), server_default=func.now())
    symptoms = Column(Text)
    diagnosis = Column(Text)
    treatment = Column(Text)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    patient = relationship("Patient", back_populates="records")