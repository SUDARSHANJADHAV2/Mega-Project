# backend/app/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# Advanced feature for later: Saving the ledger transactions in DB
class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    date = Column(String)
    description = Column(String)
    category = Column(String)
    tx_type = Column(String)
    amount = Column(Float)
