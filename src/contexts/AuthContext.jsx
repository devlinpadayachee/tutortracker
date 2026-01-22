import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('tutortracker_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (username, password) => {
    const defaultUsername = import.meta.env.VITE_ADMIN_USERNAME || 'admin'
    const defaultPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

    if (username === defaultUsername && password === defaultPassword) {
      const userData = {
        username,
        loggedInAt: new Date().toISOString(),
      }
      localStorage.setItem('tutortracker_user', JSON.stringify(userData))
      setUser(userData)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('tutortracker_user')
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}