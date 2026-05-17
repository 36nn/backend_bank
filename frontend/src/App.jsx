import { Routes, Route } from 'react-router-dom'
import StartPage from './pages/StartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserDashboard from './pages/UserDashboard'
import CashierDashboard from './pages/CashierDashboard'
import HistoryPage from './pages/HistoryPage'
import TransferPage from './pages/TransferPage'
import DepositsPage from './pages/DepositsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/cashier" element={<CashierDashboard />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/transfer" element={<TransferPage />} />
      <Route path="/deposits" element={<DepositsPage />} />
    </Routes>
  )
}

export default App