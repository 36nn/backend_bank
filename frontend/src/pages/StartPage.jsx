import { useNavigate } from 'react-router-dom'

function StartPage() {
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>BANK SYSTEM</h1>
        <p style={styles.subtitle}>
          Управление банковскими счетами
        </p>

        <button
          style={styles.login}
          onClick={() => navigate('/login')}
        >
          Вход
        </button>

        <button
          style={styles.register}
          onClick={() => navigate('/register')}
        >
          Регистрация
        </button>

        <button
          style={styles.cashier}
          onClick={() => navigate('/cashier')}
        >
          Вход кассира
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
    background: 'linear-gradient(135deg,#0f172a,#1d4ed8)'
  },
  card: {
    width: '420px',
    background: '#fff',
    padding: '50px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.25)'
  },
  title: {
    marginBottom: '10px'
  },
  subtitle: {
    color: '#64748b',
    marginBottom: '30px'
  },
  login: {
    width: '100%',
    padding: '14px',
    marginBottom: '12px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  register: {
    width: '100%',
    padding: '14px',
    marginBottom: '12px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  cashier: {
    width: '100%',
    padding: '14px',
    background: '#334155',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
  }
}

export default StartPage