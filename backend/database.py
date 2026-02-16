"""
KrushiAI Database Module
Handles database connection, ORM models, and session management.
Uses SQLite for development; can be swapped to PostgreSQL for production.
"""

from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, Text
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from datetime import datetime, timezone
import os

# Database URL - configurable via environment variable
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", "sqlite:///./krushiai.db"
)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class for all ORM models."""
    pass


class User(Base):
    """User account model supporting multiple authentication providers."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=True)
    full_name = Column(String)
    provider = Column(String, default="local")  # 'local', 'google', 'phone'
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, provider={self.provider})>"


class PredictionLog(Base):
    """Logs all ML predictions for analytics and auditing."""
    __tablename__ = "prediction_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=True, index=True)
    prediction_type = Column(String, nullable=False)  # 'crop', 'fertilizer', 'disease'
    input_data = Column(Text, nullable=True)  # JSON string of inputs
    result = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<PredictionLog(id={self.id}, type={self.prediction_type}, result={self.result})>"


# Create all tables
Base.metadata.create_all(bind=engine)


def get_db():
    """
    Dependency that provides a database session.
    Ensures the session is properly closed after use.
    
    Yields:
        Session: SQLAlchemy database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
