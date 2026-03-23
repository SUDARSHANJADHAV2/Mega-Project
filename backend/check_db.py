import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine
from sqlalchemy import inspect
from app.models import Base

# Ensure the tables are created first so we can sync them
Base.metadata.create_all(bind=engine)

inspector = inspect(engine)
for table_name in inspector.get_table_names():
    print(f"Table: {table_name}")
    for col in inspector.get_columns(table_name):
        print(f"  {col['name']}: {col['type']}")
