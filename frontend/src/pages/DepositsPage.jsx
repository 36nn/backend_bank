import { useNavigate } from 'react-router-dom'

function DepositsPage() {
  const navigate = useNavigate()

  const deposits = [
    {
      name: 'Накопительный',
      percent: 12,
      term: 6
    },
    {
      name: 'Доходный',
      percent: 15,
      term: 12
    },
    {
      name: 'Премиум',
      percent: 18,
      term: 24
    }
  ]

  const openDeposit = async (deposit) => {
    const login = localStorage.getItem('login')

    const amount = prompt('Введите сумму вклада')

    if (!amount || Number(amount) <= 0) {
      alert('Введите корректную сумму')
      return
    }

    const months = parseInt(deposit.term)
    const percent = parseInt(deposit.percent)
    const income = Math.round(
        Number(amount) * (percent / 100) * (months / 12)
    )

    const total = Number(amount) + income

    const confirmOpen = window.confirm(
      `Вклад: ${deposit.name}
Сумма: ${amount} ₽
Доход: ${income} ₽
Через ${deposit.term} мес. получите: ${total} ₽

Открыть вклад?`
    )

    if (!confirmOpen) return

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/open-deposit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            login,
            name: deposit.name,
            percent: deposit.percent + '%',
            term: deposit.term + ' месяцев',
            amount: Number(amount)
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        alert(data.message)
        navigate('/dashboard')
      } else {
        alert(data.detail)
      }
    } catch (error) {
      alert('Ошибка открытия вклада')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.phone}>
        <div style={styles.header}>
          <h1>Вклады</h1>
          <p>Выберите выгодный вариант</p>
        </div>

        <div style={styles.content}>
          {deposits.map((deposit, index) => (
            <div key={index} style={styles.card}>
              <h3>{deposit.name}</h3>
              <p>Ставка: <b>{deposit.percent}%</b></p>
              <p>Срок: {deposit.term} месяцев</p>

              <button
                style={styles.button}
                onClick={() => openDeposit(deposit)}
              >
                Открыть вклад
              </button>
            </div>
          ))}
        </div>

        <div style={styles.nav}>
          <button
            style={styles.navBtn}
            onClick={() => navigate('/dashboard')}
          >
            Главная
          </button>

          <button style={styles.navBtnActive}>
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
    background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
    color: 'white',
    padding: '30px',
    textAlign: 'center'
  },

  content: {
    padding: '20px'
  },

  card: {
    background: 'white',
    padding: '20px',
    borderRadius: '18px',
    marginBottom: '15px'
  },

  button: {
    width: '100%',
    padding: '14px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer'
  },

  nav: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '18px',
    background: '#e2e8f0'
  },

  navBtn: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '14px',
    background: '#cbd5e1',
    cursor: 'pointer'
  },

  navBtnActive: {
    padding: '12px 20px',
    border: 'none',
    borderRadius: '14px',
    background: '#2563eb',
    color: 'white'
  }
}

export default DepositsPage