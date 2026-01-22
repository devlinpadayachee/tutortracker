import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import StudentModal from '../components/StudentModal'
import { studentsAPI } from '../services/airtableService'

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const location = useLocation()

  useEffect(() => {
    fetchStudents()
  }, []) // Initial load

  // Refresh when navigating back to this page
  useEffect(() => {
    if (location.pathname === '/students') {
      fetchStudents()
    }
  }, [location.pathname])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const data = await studentsAPI.getAll()
      console.log('Fetched students with lessons:', data.map(s => ({
        name: s.name,
        lessonCount: s.lessons?.length || 0,
        lessons: s.lessons?.map(l => ({
          reference: l.reference,
          amountDue: l.amountDue,
          amountPaid: l.amountPaid
        }))
      })))
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return

    try {
      await studentsAPI.delete(id)
      fetchStudents()
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Failed to delete student')
    }
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingStudent(null)
    fetchStudents()
  }

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">Students</h2>
          <p className="text-sm sm:text-base text-slate-600">Manage your students</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[44px]"
        >
          <Plus className="w-5 h-5" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-slate-400 mb-4">
            <BookOpen className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No students found</h3>
          <p className="text-slate-500 mb-4">
            {searchTerm ? 'Try a different search term' : 'Get started by adding your first student'}
          </p>
          {!searchTerm && (
            <button onClick={() => setIsModalOpen(true)} className="btn-primary">
              Add Your First Student
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredStudents.map((student) => {
            const lessons = student.lessons || []
            const totalLessons = lessons.length

            // Calculate outstanding balance: total amount due - total amount paid
            const outstandingBalance = lessons.reduce((total, l) => {
              const amountDue = parseFloat(l.amountDue) || 0
              const amountPaid = parseFloat(l.amountPaid) || 0
              return total + (amountDue - amountPaid)
            }, 0)

            return (
              <div key={student.id} className="card hover:shadow-xl transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link
                      to={`/students/${student.id}`}
                      className="text-xl font-bold text-slate-800 hover:text-blue-600 transition-colors"
                    >
                      {student.name}
                    </Link>
                    {student.grade && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium mt-1">
                        {student.grade}
                      </span>
                    )}
                    {student.email && (
                      <p className="text-slate-600 text-sm mt-1">{student.email}</p>
                    )}
                    {student.phone && (
                      <p className="text-slate-500 text-sm">{student.phone}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="p-2 sm:p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Edit student"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="p-2 sm:p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Delete student"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 sm:pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-600">Total Lessons</span>
                    <span className="font-semibold text-slate-800">{totalLessons}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-600">Outstanding Balance</span>
                    <span className={`font-semibold text-sm sm:text-base ${outstandingBalance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      R{outstandingBalance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <StudentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        student={editingStudent}
      />
    </div>
  )
}