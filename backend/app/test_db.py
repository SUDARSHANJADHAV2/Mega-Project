import sys
import traceback
from sqlalchemy.orm import Session
from passlib.context import CryptContext

try:
    from database import SessionLocal, engine
    import models

    models.Base.metadata.create_all(bind=engine)
    
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_pw = pwd_context.hash("pass")
    
    db = SessionLocal()
    new_user = models.User(full_name="Test User", email="test_script@test.com", hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    print("Success! User ID:", new_user.id)
except Exception as e:
    print("ERROR OCCURRED:")
    traceback.print_exc()
