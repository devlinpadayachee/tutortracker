import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Users, BookOpen, GraduationCap, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/students', icon: Users, label: 'Students' },
    { path: '/lessons', icon: BookOpen, label: 'Lessons' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 sm:p-2 rounded-lg">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TutorTracker
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm lg:text-base">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-slate-200">
              <span className="text-sm text-slate-600">
                {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 min-h-[44px]"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 py-4">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 min-h-[44px] ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
                <div className="pt-2 border-t border-slate-200">
                  <div className="px-4 py-2 text-sm text-slate-600 mb-2">
                    {user?.username}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 w-full min-h-[44px]"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  )
}