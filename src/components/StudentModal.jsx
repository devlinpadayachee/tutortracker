import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { studentsAPI } from '../services/airtableService'
import { checkAirtableConfig, testAirtableConnection } from '../utils/airtableDebug'

export default function StudentModal({ isOpen, onClose, student }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    guardianName: '',
    guardianPhone: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        grade: student.grade || '',
        guardianName: student.guardianName || '',
        guardianPhone: student.guardianPhone || '',
      })
    } else {
      setFormData({ name: '', email: '', phone: '', grade: '', guardianName: '', guardianPhone: '' })
    }
  }, [student, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Debug: Check configuration
      if (!checkAirtableConfig()) {
        alert('Airtable configuration error. Please check your .env file.\n\nOpen browser console (F12) for details.')
        setLoading(false)
        return
      }

      if (student) {
        await studentsAPI.update(student.id, formData)
      } else {
        await studentsAPI.create(formData)
      }

      onClose()
    } catch (error) {
      console.error('Error saving student:', error)
      console.error('Full error details:', JSON.stringify(error, null, 2))

      let errorMessage = 'Failed to save student'

      if (error.error === 'NOT_FOUND' || error.statusCode === 404) {
        errorMessage = 'Table "Students" not found!\n\nPlease check:\n' +
          '1. Table name is exactly "Students" (case-sensitive)\n' +
          '2. Your Personal Access Token has access to this base\n' +
          '3. Your Base ID is correct\n' +
          '4. The table exists in your Airtable base\n\n' +
          'Check browser console (F12) for more details.'
      } else if (error.statusCode === 401 || error.statusCode === 403) {
        errorMessage = 'Authentication failed!\n\n' +
          'Please check:\n' +
          '1. Your Personal Access Token is correct\n' +
          '2. Token has scopes: data.records:read and data.records:write\n' +
          '3. Token has access to your base'
      } else if (error.message) {
        errorMessage = `Error: ${error.message}\n\nCheck browser console (F12) for details.`
      }

      alert(errorMessage)

      // Offer to test connection
      if (confirm('Would you like to test your Airtable connection?')) {
        await testAirtableConnection()
      }
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
            {student ? 'Edit Student' : 'Add New Student'}
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="Enter student name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Grade</label>
            <input
              type="text"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="input-field"
              placeholder="e.g., Grade 5, Year 10"
            />
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Guardian Information</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Guardian Name
                </label>
                <input
                  type="text"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  className="input-field"
                  placeholder="Enter guardian name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Guardian Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  className="input-field"
                  placeholder="Enter guardian phone number"
                />
              </div>
            </div>
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
              {loading ? 'Saving...' : student ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}