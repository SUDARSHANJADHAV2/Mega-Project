from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.dependencies import get_password_hash, verify_password, create_access_token
import traceback

router = APIRouter(
    prefix="/api",
    tags=["Authentication"],
)

@router.post("/register")
def register_user(user: schemas.FullNameRequest, db: Session = Depends(get_db)):
    try:
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        hashed_pw = get_password_hash(user.password)
        new_user = models.User(full_name=user.full_name, email=user.email, hashed_password=hashed_pw)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        access_token = create_access_token(data={"sub": new_user.email})
        return {"access_token": access_token, "token_type": "bearer", "user": {"name": new_user.full_name, "email": new_user.email}}
    except HTTPException:
        raise
    except Exception as e:
        error_details = traceback.format_exc()
        # FIXED: Proper error raising instead of swallowing into a 200 response
        raise HTTPException(status_code=500, detail="Internal server error during registration")

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": {"name": user.full_name, "email": user.email}}
