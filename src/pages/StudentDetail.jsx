import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Edit, Trash2, DollarSign, Calendar } from 'lucide-react'
import LessonModal from '../components/LessonModal'
import { format } from 'date-fns'
import { studentsAPI, lessonsAPI } from '../services/airtableService'

export default function StudentDetail() {
  const { id } = useParams()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)

  useEffect(() => {
    fetchStudent()
  }, [id])

  const fetchStudent = async () => {
    try {
      const data = await studentsAPI.getById(id)
      setStudent(data)
    } catch (error) {
      console.error('Error fetching student:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return

    try {
      await lessonsAPI.delete(lessonId)
      fetchStudent()
    } catch (error) {
      console.error('Error deleting lesson:', error)
      alert('Failed to delete lesson')
    }
  }

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson)
    setIsLessonModalOpen(true)
  }

  const handleModalClose = () => {
    setIsLessonModalOpen(false)
    setEditingLesson(null)
    fetchStudent()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Student not found</p>
        <Link to="/students" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          ← Back to Students
        </Link>
      </div>
    )
  }

  const totalLessons = student.lessons?.length || 0

  // Calculate outstanding balance: total amount due - total amount paid
  const outstandingBalance = student.lessons?.reduce((total, l) => {
    const amountDue = parseFloat(l.amountDue) || 0
    const amountPaid = parseFloat(l.amountPaid) || 0
    return total + (amountDue - amountPaid)
  }, 0) || 0

  // Calculate total revenue: sum of all amounts paid
  const totalRevenue = student.lessons?.reduce((sum, l) => {
    return sum + (parseFloat(l.amountPaid) || 0)
  }, 0) || 0

  return (
    <div className="space-y-6">
      <Link
        to="/students"
        className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors min-h-[44px] text-sm sm:text-base"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Students</span>
      </Link>

      {/* Student Info */}
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 break-words">{student.name}</h2>
            <div className="space-y-2">
              {student.grade && (
                <p className="text-slate-600">
                  <span className="font-medium">Grade:</span> {student.grade}
                </p>
              )}
              {student.email && (
                <p className="text-slate-600">📧 {student.email}</p>
              )}
              {student.phone && (
                <p className="text-slate-600">📞 {student.phone}</p>
              )}
            </div>

            {(student.guardianName || student.guardianPhone) && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Guardian Information</h3>
                {student.guardianName && (
                  <p className="text-slate-600 text-sm mb-1">
                    <span className="font-medium">Name:</span> {student.guardianName}
                  </p>
                )}
                {student.guardianPhone && (
                  <p className="text-slate-600 text-sm">
                    <span className="font-medium">Phone:</span> {student.guardianPhone}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
          <div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">Total Lessons</p>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">{totalLessons}</p>
          </div>
          <div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">Outstanding Balance</p>
            <p className={`text-xl sm:text-2xl font-bold ${outstandingBalance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              R{outstandingBalance.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-slate-600 text-xs sm:text-sm mb-1">Total Revenue</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">R{totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800">Lessons</h3>
          <button
            onClick={() => setIsLessonModalOpen(true)}
            className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto min-h-[44px]"
          >
            <Plus className="w-5 h-5" />
            <span>Add Lesson</span>
          </button>
        </div>

        {student.lessons?.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-slate-300" />
            <p>No lessons yet. Add your first lesson!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {student.lessons?.map((lesson) => (
              <div
                key={lesson.id}
                className="p-3 sm:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <span className="font-semibold text-sm sm:text-base text-slate-800 whitespace-nowrap">
                        {lesson.date ? format(new Date(lesson.date), 'MMM dd, yyyy') : 'No date'}
                      </span>
                      {lesson.subject && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs sm:text-sm">
                          {lesson.subject}
                        </span>
                      )}
                      <span className="text-xs sm:text-sm text-slate-600 whitespace-nowrap">
                        {lesson.duration} minutes
                      </span>
                    </div>
                    {lesson.notes && (
                      <p className="text-xs sm:text-sm text-slate-600 mb-2 break-words">{lesson.notes}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
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
                            <span className="flex items-center space-x-1 text-green-600">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-medium">
                                Paid R{amountPaid.toFixed(2)}
                              </span>
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
                      onClick={() => handleEditLesson(lesson)}
                      className="p-2 sm:p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Edit lesson"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
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
        )}
      </div>

      <LessonModal
        isOpen={isLessonModalOpen}
        onClose={handleModalClose}
        lesson={editingLesson}
        studentId={id}
      />
    </div>
  )
}