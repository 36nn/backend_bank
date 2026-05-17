import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function UserDashboard() {
  const navigate = useNavigate()

  const [balance, setBalance] = useState(0)
  const [accountNumber, setAccountNumber] = useState('')

  const login = localStorage.getItem('login')

  useEffect(() => {
    if (!login) {
      navigate('/login')
      return
    }

    fetchBalance()
  }, [login, navigate])

  const fetchBalance = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/user/${login}`)
      const data = await response.json()

      if (response.ok) {
        setBalance(data.balance)
        setAccountNumber(data.account_number)
      } else {
        alert(data.detail)
      }
    } catch (error) {
      console.log(error)
      alert('Ошибка загрузки данных')
    }
  }

  const handleDeposit = async () => {
    const amount = prompt('Введите сумму пополнения')

    if (!amount || Number(amount) <= 0) {
      alert('Введите корректную сумму')
      return
    }

    const response = await fetch('http://127.0.0.1:8000/deposit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login,
        amount: Number(amount)
      })
    })

    const data = await response.json()

    if (response.ok) {
      setBalance(data.balance)
      alert(data.message)
    } else {
      alert(data.detail)
    }
  }

  const handleWithdraw = async () => {
    const amount = prompt('Введите сумму снятия')

    if (!amount || Number(amount) <= 0) {
      alert('Введите корректную сумму')
      return
    }

    const response = await fetch('http://127.0.0.1:8000/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        login,
        amount: Number(amount)
      })
    })

    const data = await response.json()

    if (response.ok) {
      setBalance(data.balance)
      alert(data.message)
    } else {
      alert(data.detail)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('login')
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      <div style={styles.phone}>
        <div style={styles.header}>
          <p style={styles.account}>Основной счёт</p>
          <h1 style={styles.balance}>
            {balance.toLocaleString()} ₽
          </h1>
          <p style={styles.available}>Доступно</p>

          <div style={styles.actions}>
            <button style={styles.actionBtn} onClick={handleDeposit}>
              Пополнить
            </button>

            <button
              style={styles.actionBtn}
              onClick={() => navigate('/transfer')}
            >
              Перевести
            </button>

            <button style={styles.actionBtn} onClick={handleWithdraw}>
              Снять
            </button>
          </div>
        </div>

        <div style={styles.infoCard}>
          <h3>Информация по счёту</h3>

          <div style={styles.row}>
            <span>Логин</span>
            <b>{login}</b>
          </div>

          <div style={styles.row}>
            <span>Номер счёта</span>
            <b>{accountNumber}</b>
          </div>

          <button
            style={styles.historyBtn}
            onClick={() => navigate('/history')}
          >
            История операций
          </button>

          <button
            style={styles.exitBtn}
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>

        <div style={styles.bottomNav}>
          <button
            style={styles.navBtnActive}
            onClick={() => navigate('/dashboard')}
          >
            Главная
          </button>

          <button
            style={styles.navBtn}
            onClick={() => navigate('/deposits')}
          >
            Вклады
          </button>

          <button
            style={styles.navBtn}
            onClick={() => navigate('/history')}
          >
            История
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f172a',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  phone: {
    width: '380px',
    background: '#f8fafc',
    borderRadius: '35px',
    overflow: 'hidden'
  },

  header: {
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    padding: '35px 25px',
    color: 'white',
    textAlign: 'center'
  },

  account: {
    opacity: 0.8
  },

  balance: {
    fontSize: '38px'
  },

  available: {
    opacity: 0.8
  },

  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '25px'
  },

  actionBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    color: 'white',
    padding: '12px',
    borderRadius: '14px',
    cursor: 'pointer',
    width: '31%'
  },

  infoCard: {
    padding: '25px'
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '18px 0'
  },

  historyBtn: {
    width: '100%',
    padding: '14px',
    marginTop: '25px',
    border: 'none',
    background: '#2563eb',
    color: 'white',
    borderRadius: '14px',
    cursor: 'pointer'
  },

  exitBtn: {
    width: '100%',
    padding: '14px',
    marginTop: '12px',
    border: 'none',
    background: '#ef4444',
    color: 'white',
    borderRadius: '14px',
    cursor: 'pointer'
  },

  bottomNav: {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '14px 18px',
  background: '#ffffff',
  borderTop: '1px solid #e2e8f0'
},

  navBtn: {
  flex: 1,
  margin: '0 4px',
  padding: '12px',
  border: 'none',
  borderRadius: '14px',
  background: '#f1f5f9',
  color: '#64748b',
  cursor: 'pointer',
  fontWeight: '600',
  transition: '0.2s'
},

  navBtnActive: {
  flex: 1,
  margin: '0 4px',
  padding: '12px',
  border: 'none',
  borderRadius: '14px',
  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  color: 'white',
  cursor: 'pointer',
  fontWeight: '700',
  boxShadow: '0 6px 14px rgba(37,99,235,0.25)'
}
}

export default UserDashboard