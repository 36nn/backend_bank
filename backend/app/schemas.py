from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    login: str
    password: str

class UserLogin(BaseModel):
    login: str
    password: str

class BalanceUpdate(BaseModel):
    login: str
    amount: int

class BalanceUpdate(BaseModel):
    login: str
    amount: int

class TransferData(BaseModel):
    from_login: str
    to_login: str
    amount: int