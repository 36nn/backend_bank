from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import random
import psycopg2

from .database import engine, SessionLocal
from .models import Base, User, Operation
from app.schemas import UserCreate, UserLogin, BalanceUpdate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_connection():
    conn_string = "dbname=bank_db user=postgres password=12345 host=localhost port=5432"
    return psycopg2.connect(conn_string)

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Bank API работает"}


@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    account_number = "101-" + str(random.randint(1, 999)).zfill(3)

    existing = db.query(User).filter(User.login == user.login).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Пользователь уже существует"
        )

    new_user = User(
        name=user.name,
        login=user.login,
        password=user.password,
        balance=0,
        account_number=account_number
    )

    db.add(new_user)
    db.commit()

    return {
        "message": "Пользователь создан",
        "account_number": account_number
    }


@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        User.login == user.login,
        User.password == user.password
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Неверный логин или пароль"
        )

    return {
        "message": "Вход выполнен",
        "name": existing_user.name,
        "role": existing_user.role
    }


@app.post("/deposit")
def deposit(data: BalanceUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.login == data.login).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Пользователь не найден"
        )

    if data.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Сумма должна быть больше нуля"
        )

    user.balance += data.amount

    operation = Operation(
        login=user.login,
        type="Пополнение",
        amount=data.amount
    )

    db.add(operation)
    db.commit()
    db.refresh(user)

    return {
        "message": "Баланс пополнен",
        "balance": user.balance
    }


@app.post("/withdraw")
def withdraw(data: BalanceUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.login == data.login).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Пользователь не найден"
        )

    if data.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Некорректная сумма"
        )

    if user.balance < data.amount:
        raise HTTPException(
            status_code=400,
            detail="Недостаточно средств"
        )

    user.balance -= data.amount

    operation = Operation(
        login=user.login,
        type="Снятие",
        amount=data.amount
    )

    db.add(operation)
    db.commit()
    db.refresh(user)

    return {
        "message": "Средства сняты",
        "balance": user.balance
    }


@app.post("/open-deposit")
def open_deposit(data: dict):
    conn = get_connection()
    cur = conn.cursor()

    try:
        login = data["login"]
        name = data["name"]
        percent = data["percent"]
        term = data["term"]
        amount = data["amount"]

        cur.execute(
            "SELECT balance FROM users WHERE login = %s",
            (login,)
        )

        user = cur.fetchone()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="Пользователь не найден"
            )

        balance = user[0]

        if balance < amount:
            raise HTTPException(
                status_code=400,
                detail="Недостаточно средств для открытия вклада"
            )

        new_balance = balance - amount

        cur.execute(
            """
            UPDATE users
            SET balance = %s
            WHERE login = %s
            """,
            (new_balance, login)
        )

        cur.execute(
            """
            INSERT INTO deposits
            (login, name, percent, term)
            VALUES (%s, %s, %s, %s)
            """,
            (login, name, percent, term)
        )

        cur.execute(
            """
            INSERT INTO operations
            (login, type, amount)
            VALUES (%s, %s, %s)
            """,
            (
                login,
                f'Открытие вклада "{name}"',
                amount
            )
        )

        conn.commit()

        return {
            "message": f'Вклад "{name}" успешно открыт',
            "balance": new_balance
        }

    finally:
        cur.close()
        conn.close()
@app.post("/transfer")
def transfer(data: dict, db: Session = Depends(get_db)):
    sender = db.query(User).filter(
        User.login == data.get("from_login")
    ).first()

    receiver = db.query(User).filter(
        User.account_number == data.get("to_account")
    ).first()

    if not sender:
        raise HTTPException(
            status_code=404,
            detail="Отправитель не найден"
        )

    if not receiver:
        raise HTTPException(
            status_code=404,
            detail="Получатель не найден"
        )

    if sender.login == receiver.login:
        raise HTTPException(
            status_code=400,
            detail="Нельзя переводить самому себе"
        )

    amount = int(data.get("amount", 0))

    if amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Некорректная сумма"
        )

    if sender.balance < amount:
        raise HTTPException(
            status_code=400,
            detail="Недостаточно средств"
        )

    sender.balance -= amount
    receiver.balance += amount

    db.add(Operation(
        login=sender.login,
        type=f"Перевод пользователю {receiver.login}",
        amount=amount
    ))

    db.add(Operation(
        login=receiver.login,
        type=f"Получено от {sender.login}",
        amount=amount
    ))

    db.commit()
    db.refresh(sender)

    return {
        "message": "Перевод выполнен",
        "balance": sender.balance
    }

@app.get("/user/{login}")
def get_user(login: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.login == login
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Пользователь не найден"
        )

    return {
        "balance": user.balance,
        "account_number": user.account_number,
        "name": user.name
    }


@app.get("/history/{login}")
def get_history(login: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT type, amount
        FROM operations
        WHERE login = %s
        ORDER BY id DESC
    """, (login,))

    operations = cur.fetchall()

    cur.close()
    conn.close()

    return [
        {
            "type": op[0],
            "amount": op[1]
        }
        for op in operations
    ]