import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    if (!login || !password) {
      alert('Заполните все поля')
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: login.trim(),
          password: password.trim()
        })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('login', login.trim())

        if (data.role === 'cashier') {
          navigate('/cashier')
        } else {
          navigate('/dashboard')
        }
      } else {
        alert(data.detail)
      }
    } catch (error) {
      console.log(error)
      alert('Ошибка подключения')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Вход</h1>

        <input
          style={styles.input}
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Войти
        </button>

        <button style={styles.back} onClick={() => navigate('/')}>
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
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    width: '400px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
  },

  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  },

  button: {
    width: '100%',
    padding: '14px',
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
  },

  back: {
    width: '100%',
    padding: '14px',
    marginTop: '10px',
    background: '#e2e8f0',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
  }
}

export default LoginPage