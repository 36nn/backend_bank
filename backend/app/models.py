from sqlalchemy import Column, Integer, String, ForeignKey
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    login = Column(String, unique=True)
    password = Column(String)
    role = Column(String, default="user")
    balance = Column(Integer, default=0)
    account_number = Column(String, unique=True)


class Operation(Base):
    __tablename__ = "operations"

    id = Column(Integer, primary_key=True, index=True)
    login = Column(String)
    type = Column(String)
    amount = Column(Integer)