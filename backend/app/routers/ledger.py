from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.dependencies import get_current_user
from typing import List

router = APIRouter(
    prefix="/api",
    tags=["Ledger"],
)

@router.get("/ledger")
def get_ledger_transactions(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    transactions = db.query(models.Transaction).filter(models.Transaction.user_id == current_user.id).all()
    return transactions

@router.post("/ledger")
def add_ledger_transaction(req: schemas.LedgerRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        new_tx = models.Transaction(
            user_id=current_user.id,
            date=req.date,
            description=req.description,
            category=req.category,
            tx_type=req.tx_type,
            amount=req.amount
        )
        db.add(new_tx)
        db.commit()
        db.refresh(new_tx)
        return new_tx
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to add transaction: {str(e)}")

@router.delete("/ledger/{tx_id}")
def delete_ledger_transaction(tx_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    tx = db.query(models.Transaction).filter(models.Transaction.id == tx_id, models.Transaction.user_id == current_user.id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found or not authorized")
    
    try:
        db.delete(tx)
        db.commit()
        return {"message": "Transaction deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete transaction: {str(e)}")
