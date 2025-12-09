import { describe, it, expect } from 'vitest'
import { validateField, FormField } from '../FormBuilder'

describe('validateField', () => {
  it('accepts 0 for required number fields', () => {
    const field: FormField = {
      id: 'num',
      type: 'number',
      label: 'Number',
      required: true,
      validation: { min: 0 }
    }

    const result = validateField(field, 0)
    expect(result).toBeNull()
  })

  it('rejects non-numeric input for number fields', () => {
    const field: FormField = {
      id: 'num',
      type: 'number',
      label: 'Number',
      required: true,
      validation: { min: 0 }
    }

    const result = validateField(field, 'abc')
    expect(result).toBe('Must be a valid number')
  })
})