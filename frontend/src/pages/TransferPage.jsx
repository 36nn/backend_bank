import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function TransferPage() {
  const navigate = useNavigate()

  const [accountNumber, setAccountNumber] = useState('')
  const [amount, setAmount] = useState('')

  const handleTransfer = async () => {
    const currentLogin = localStorage.getItem('login')

    if (!currentLogin) {
      alert('Вы не авторизованы')
      navigate('/login')
      return
    }

    if (!accountNumber || !amount) {
      alert('Заполните все поля')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from_login: currentLogin,
          to_account: accountNumber,
          amount: Number(amount)
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message)
        navigate('/dashboard')
      } else {
        alert(data.detail)
      }
    } catch (error) {
      console.log(error)
      alert('Ошибка перевода')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Перевод</h1>

        <input
          style={styles.input}
          placeholder="Номер счёта"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button style={styles.button} onClick={handleTransfer}>
          Перевести
        </button>

        <button style={styles.back} onClick={() => navigate('/dashboard')}>
          Назад
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#0f172a'
  },

  card: {
    background: '#f8fafc',
    padding: '50px',
    borderRadius: '30px',
    width: '500px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.35)'
  },

  input: {
    width: '100%',
    padding: '18px',
    marginBottom: '20px',
    borderRadius: '14px',
    border: '1px solid #cbd5e1',
    fontSize: '16px',
    boxSizing: 'border-box'
  },

  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '15px',
    transition: '0.3s'
  },

  back: {
    width: '100%',
    padding: '16px',
    background: '#e2e8f0',
    color: '#0f172a',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: '0.3s'
  }
}

export default TransferPage