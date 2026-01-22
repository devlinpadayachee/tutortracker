import { useEffect, useState } from 'react'
import { Users, BookOpen, DollarSign, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { statsAPI, lessonsAPI } from '../services/airtableService'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentLessons, setRecentLessons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchRecentLessons()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await statsAPI.getStats()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentLessons = async () => {
    try {
      const data = await lessonsAPI.getAll()
      setRecentLessons(data.slice(0, 5))
    } catch (error) {
      console.error('Error fetching lessons:', error)
    }
  }

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Total Lessons',
      value: stats?.totalLessons || 0,
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Unpaid Lessons',
      value: stats?.unpaidLessons || 0,
      icon: Clock,
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Total Revenue',
      value: `R${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">Dashboard</h2>
        <p className="text-sm sm:text-base text-slate-600">Overview of your tutoring business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-slate-600 text-xs sm:text-sm font-medium mb-1 truncate">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800 break-words">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Lessons */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800">Recent Lessons</h3>
          <Link to="/lessons" className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium min-h-[44px] flex items-center">
            View All →
          </Link>
        </div>
        {recentLessons.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p>No lessons yet. Start by adding a lesson!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Link
                      to={`/students/${lesson.studentId}`}
                      className="font-semibold text-sm sm:text-base text-slate-800 hover:text-blue-600 break-words"
                    >
                      {lesson.student?.name || 'Unknown Student'}
                    </Link>
                    <span className="text-xs sm:text-sm text-slate-500 whitespace-nowrap">
                      {lesson.date ? new Date(lesson.date).toLocaleDateString() : 'No date'}
                    </span>
                    {lesson.reference && (
                      <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-mono font-semibold">
                        {lesson.reference}
                      </span>
                    )}
                    {lesson.subject && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs sm:text-sm">
                        {lesson.subject}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 break-words">
                    {lesson.duration} minutes
                    {lesson.notes && ` • ${lesson.notes.substring(0, 50)}`}
                  </p>
                </div>
                <div className="flex items-center flex-wrap gap-2 sm:gap-2">
                  {(() => {
                    const amountDue = parseFloat(lesson.amountDue) || 0;
                    const amountPaid = parseFloat(lesson.amountPaid) || 0;
                    const remainingDue = amountDue - amountPaid;

                    // Fully paid
                    if (amountDue > 0 && amountPaid >= amountDue) {
                      return (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Paid R{amountPaid.toFixed(2)}
                        </span>
                      );
                    }
                    // Outstanding (partially paid - has payment but balance remains)
                    else if (amountDue > 0 && amountPaid > 0 && remainingDue > 0) {
                      return (
                        <>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                            Outstanding R{remainingDue.toFixed(2)}
                          </span>
                          <span className="text-green-600 text-sm">
                            Paid R{amountPaid.toFixed(2)}
                          </span>
                        </>
                      );
                    }
                    // Unpaid (no payment made)
                    else if (amountDue > 0 && amountPaid === 0) {
                      return (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          Unpaid R{amountDue.toFixed(2)}
                        </span>
                      );
                    }
                    // No amount due set
                    else {
                      return (
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                          {lesson.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      );
                    }
                  })()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}