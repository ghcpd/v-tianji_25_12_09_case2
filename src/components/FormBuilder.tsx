import { useState, useRef, useEffect } from 'react'
import './FormBuilder.css'

export type FormField = {
  id: string
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'date'
  label: string
  required: boolean
  placeholder?: string
  options?: string[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export function validateField(field: FormField, value: string | number): string | null {
  if (field.required && (typeof value === 'string' ? value.trim() === '' : value === undefined || value === null)) {
    return `${field.label} is required`
  }

  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value as string)) {
      return 'Invalid email format'
    }
  }

  if (field.type === 'number' && value !== '' && value !== undefined && value !== null) {
    const numValue = Number(value)
    if (isNaN(numValue)) {
      return 'Must be a valid number'
    }
    if (field.validation?.min !== undefined && numValue < field.validation.min) {
      return `Must be at least ${field.validation.min}`
    }
    if (field.validation?.max !== undefined && numValue > field.validation.max) {
      return `Must be at most ${field.validation.max}`
    }
  }

  return null
}



interface FormData {
  [key: string]: string | number
}

function FormBuilder() {
  const [fields, setFields] = useState<FormField[]>([
    {
      id: 'name',
      type: 'text',
      label: 'Full Name',
      required: true,
      placeholder: 'Enter your full name'
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      placeholder: 'Enter your email'
    }
  ])

  const [formData, setFormData] = useState<FormData>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const [newFieldType, setNewFieldType] = useState<FormField['type']>('text')
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [showAddField, setShowAddField] = useState(false)

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false)
        setFormData({})
        setErrors({})
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [submitSuccess])

  const handleFieldChange = (fieldId: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    
    const field = fields.find(f => f.id === fieldId)
    if (field) {
      const error = validateField(field, value)
      setErrors(prev => {
        if (error) {
          return { ...prev, [fieldId]: error }
        } else {
          const newErrors = { ...prev }
          delete newErrors[fieldId]
          return newErrors
        }
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: Record<string, string> = {}
    fields.forEach(field => {
      const value = formData[field.id]
      const error = validateField(field, value as string | number)
      if (error) {
        newErrors[field.id] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitSuccess(false)

    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Form submitted:', formData)
    setIsSubmitting(false)
    setSubmitSuccess(true)
  }

  const addField = () => {
    if (!newFieldLabel.trim()) return

    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: newFieldType,
      label: newFieldLabel,
      required: false,
      placeholder: `Enter ${newFieldLabel.toLowerCase()}`
    }

    if (newFieldType === 'select') {
      newField.options = ['Option 1', 'Option 2', 'Option 3']
    }

    if (newFieldType === 'number') {
      newField.validation = { min: 0, max: 100 }
    }

    setFields(prev => [...prev, newField])
    setNewFieldLabel('')
    setShowAddField(false)
  }

  const removeField = (fieldId: string) => {
    setFields(prev => prev.filter(f => f.id !== fieldId))
    setFormData(prev => {
      const newData = { ...prev }
      delete newData[fieldId]
      return newData
    })
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[fieldId]
      return newErrors
    })
  }

  const renderField = (field: FormField) => {
    const value = formData[field.id] || ''
    const error = errors[field.id]

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.id} className="form-field">
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <textarea
              id={field.id}
              value={value as string}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'error' : ''}
              rows={4}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        )

      case 'select':
        return (
          <div key={field.id} className="form-field">
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <select
              id={field.id}
              value={value as string}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={error ? 'error' : ''}
            >
              <option value="">Select an option</option>
              {field.options?.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && <span className="error-message">{error}</span>}
          </div>
        )

      case 'date':
        return (
          <div key={field.id} className="form-field">
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="date"
              id={field.id}
              value={value as string}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        )

      default:
        return (
          <div key={field.id} className="form-field">
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type={field.type}
              id={field.id}
              value={value as string | number}
              onChange={(e) => handleFieldChange(field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'error' : ''}
              min={field.validation?.min}
              max={field.validation?.max}
            />
            {error && <span className="error-message">{error}</span>}
          </div>
        )
    }
  }

  return (
    <div className="form-builder">
      <div className="form-builder-header">
        <h1>Dynamic Form Builder</h1>
        <button
          className="add-field-button"
          onClick={() => setShowAddField(!showAddField)}
        >
          {showAddField ? 'Cancel' : '+ Add Field'}
        </button>
      </div>

      {showAddField && (
        <div className="add-field-panel">
          <div className="add-field-controls">
            <input
              type="text"
              placeholder="Field label"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              className="field-label-input"
            />
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value as FormField['type'])}
              className="field-type-select"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="textarea">Textarea</option>
              <option value="select">Select</option>
              <option value="date">Date</option>
            </select>
            <button onClick={addField} className="confirm-add-button">
              Add
            </button>
          </div>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="dynamic-form">
        {fields.map(field => (
          <div key={field.id} className="form-field-wrapper">
            {renderField(field)}
            <button
              type="button"
              onClick={() => removeField(field.id)}
              className="remove-field-button"
              aria-label="Remove field"
            >
              ×
            </button>
          </div>
        ))}

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </button>
          {submitSuccess && (
            <div className="success-message">
              Form submitted successfully!
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default FormBuilder

