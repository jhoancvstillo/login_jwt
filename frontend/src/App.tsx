import { Route, Routes } from 'react-router-dom'
import './App.css'
import { ProtectedRoute } from './providers/protectedRoute'
import LoginForm from './components/login/Login'

function App() {

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={
        <ProtectedRoute>
          <div className="flex h-screen ">
            <h1>PAGINA  PROTEGIDA </h1>
          </div>
        </ProtectedRoute>
      } />
    </Routes>
)
}


export default App
