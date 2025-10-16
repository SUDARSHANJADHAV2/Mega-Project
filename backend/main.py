from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import timedelta
import os

from . import crud, models, schemas, security
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Get the absolute path to the project root directory
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app.mount("/css", StaticFiles(directory=os.path.join(ROOT_DIR, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(ROOT_DIR, "js")), name="js")
app.mount("/images", StaticFiles(directory=os.path.join(ROOT_DIR, "images")), name="images")
app.mount("/KrushiAI-Weather-Forecast", StaticFiles(directory=os.path.join(ROOT_DIR, "KrushiAI-Weather-Forecast")), name="KrushiAI-Weather-Forecast")
app.mount("/guide", StaticFiles(directory=os.path.join(ROOT_DIR, "guide")), name="guide")
app.mount("/explore", StaticFiles(directory=os.path.join(ROOT_DIR, "explore")), name="explore")

@app.get("/")
async def read_index():
    return FileResponse(os.path.join(ROOT_DIR, 'index.html'))

@app.get("/login.html")
async def read_login():
    return FileResponse(os.path.join(ROOT_DIR, 'login.html'))

@app.get("/signup.html")
async def read_signup():
    return FileResponse(os.path.join(ROOT_DIR, 'signup.html'))

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(security.get_current_active_user)):
    return current_user