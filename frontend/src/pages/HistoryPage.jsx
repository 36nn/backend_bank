import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function HistoryPage() {
  const navigate = useNavigate()
  const [operations, setOperations] = useState([])

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    const login = localStorage.getItem('login')

    if (!login) {
      navigate('/login')
      return
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/history/${login}`
      )

      const data = await response.json()

      if (response.ok) {
        setOperations(data)
      } else {
        alert(data.detail)
      }

    } catch (error) {
      console.log(error)
      alert('Ошибка загрузки истории')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>История операций</h1>

        {operations.length === 0 ? (
          <p>Операций пока нет</p>
        ) : (
          operations.map((item, index) => (
            <div key={index} style={styles.operation}>
              <span>{item.type}</span>
              <b>{item.amount} ₽</b>
            </div>
          ))
        )}

        <button
          style={styles.button}
          onClick={() => navigate('/dashboard')}
        >
          Назад
        </button>
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

  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    width: '600px'
  },

  operation: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px',
    borderBottom: '1px solid #eee'
  },

  button: {
    width: '100%',
    padding: '14px',
    marginTop: '20px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
  }
}

export default HistoryPage