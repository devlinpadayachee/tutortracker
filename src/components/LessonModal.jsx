import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { lessonsAPI } from '../services/airtableService'

export default function LessonModal({ isOpen, onClose, lesson, studentId, students }) {
  const [formData, setFormData] = useState({
    studentId: studentId || '',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    subject: '',
    notes: '',
    isPaid: false,
    amountPaid: '',
    amountDue: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (lesson) {
      setFormData({
        studentId: lesson.studentId || '',
        date: lesson.date ? new Date(lesson.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        duration: lesson.duration || 60,
        subject: lesson.subject || '',
        notes: lesson.notes || '',
        isPaid: lesson.isPaid || false,
        amountPaid: lesson.amountPaid?.toString() || '',
        amountDue: lesson.amountDue?.toString() || '',
      })
    } else {
      // Pre-select student when coming from student card, or reset form
      setFormData({
        studentId: studentId || '',
        date: new Date().toISOString().split('T')[0],
        duration: 60,
        subject: '',
        notes: '',
        isPaid: false,
        amountPaid: '',
        amountDue: '',
      })
    }
  }, [lesson, studentId, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        duration: parseInt(formData.duration),
        amountPaid: formData.amountPaid ? parseFloat(formData.amountPaid) : null,
        amountDue: formData.amountDue ? parseFloat(formData.amountDue) : null,
      }

      if (lesson) {
        await lessonsAPI.update(lesson.id, payload)
      } else {
        await lessonsAPI.create(payload)
      }

      onClose()
    } catch (error) {
      console.error('Error saving lesson:', error)
      alert('Failed to save lesson')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
            {lesson ? 'Edit Lesson' : 'Add New Lesson'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {students && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Student <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="input-field"
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student?.name || 'Unknown Student'}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="input-field"
                placeholder="e.g., Math, Science"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Add any notes about this lesson..."
            />
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amount Due (R)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amountDue}
                onChange={(e) => setFormData({ ...formData, amountDue: e.target.value })}
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isPaid"
                checked={formData.isPaid}
                onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isPaid" className="text-sm font-medium text-slate-700">
                Mark as paid
              </label>
            </div>

            {formData.isPaid && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Amount Paid (R)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amountPaid}
                  onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 min-h-[44px]"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 min-h-[44px]" disabled={loading}>
              {loading ? 'Saving...' : lesson ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}