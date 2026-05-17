import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    login: '',
    password: ''
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async () => {
    const response = await fetch('http://127.0.0.1:8000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })

    const data = await response.json()

    if (response.ok) {
      alert(data.message)
      navigate('/login')
    } else {
      alert(data.detail)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Регистрация</h1>

        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Имя"
          onChange={handleChange}
        />

        <input
          style={styles.input}
          type="text"
          name="login"
          placeholder="Логин"
          onChange={handleChange}
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Пароль"
          onChange={handleChange}
        />

        <button style={styles.button} onClick={handleRegister}>
          Зарегистрироваться
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
    width: '400px'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc'
  },
  button: {
    width: '100%',
    padding: '14px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '10px'
  },
  back: {
    width: '100%',
    padding: '14px',
    marginTop: '10px',
    background: '#e2e8f0',
    border: 'none',
    borderRadius: '10px'
  }
}

export default RegisterPage