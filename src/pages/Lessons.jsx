import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Trash2, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import LessonModal from '../components/LessonModal'
import { format } from 'date-fns'
import { lessonsAPI, studentsAPI } from '../services/airtableService'

export default function Lessons() {
  const [lessons, setLessons] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)

  useEffect(() => {
    fetchLessons()
    fetchStudents()
  }, [])

  const fetchLessons = async () => {
    try {
      const data = await lessonsAPI.getAll()
      setLessons(data)
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const data = await studentsAPI.getAll()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return

    try {
      await lessonsAPI.delete(id)
      fetchLessons()
    } catch (error) {
      console.error('Error deleting lesson:', error)
      alert('Failed to delete lesson')
    }
  }

  const handleEdit = (lesson) => {
    setEditingLesson(lesson)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingLesson(null)
    fetchLessons()
  }

  const filteredLessons = lessons.filter((lesson) =>
    lesson.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.subject?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">Lessons</h2>
          <p className="text-sm sm:text-base text-slate-600">Track all your lessons</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[44px]"
        >
          <Plus className="w-5 h-5" />
          <span>Add Lesson</span>
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search lessons by student or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Lessons List */}
      {filteredLessons.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-slate-400 mb-4">
            <Calendar className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No lessons found</h3>
          <p className="text-slate-500 mb-4">
            {searchTerm ? 'Try a different search term' : 'Get started by adding your first lesson'}
          </p>
          {!searchTerm && (
            <button onClick={() => setIsModalOpen(true)} className="btn-primary">
              Add Your First Lesson
            </button>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="space-y-3">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="p-3 sm:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <Link
                        to={`/students/${lesson.studentId}`}
                        className="font-semibold text-sm sm:text-base text-slate-800 hover:text-blue-600 transition-colors break-words"
                      >
                        {lesson.student.name}
                      </Link>
                      <span className="text-xs sm:text-sm text-slate-600 whitespace-nowrap">
                        {format(new Date(lesson.date), 'MMM dd, yyyy')}
                      </span>
                      {lesson.subject && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs sm:text-sm">
                          {lesson.subject}
                        </span>
                      )}
                      <span className="text-xs sm:text-sm text-slate-500 whitespace-nowrap">
                        {lesson.duration} min
                      </span>
                    </div>
                    {lesson.notes && (
                      <p className="text-xs sm:text-sm text-slate-600 mb-2 break-words">{lesson.notes}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2">
                      {lesson.reference && (
                        <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-mono font-semibold">
                          {lesson.reference}
                        </span>
                      )}
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
                  <div className="flex space-x-2 sm:ml-4">
                    <button
                      onClick={() => handleEdit(lesson)}
                      className="p-2 sm:p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Edit lesson"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="p-2 sm:p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Delete lesson"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <LessonModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        lesson={editingLesson}
        students={students}
      />
    </div>
  )
}