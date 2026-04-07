// Validate email
export const validateEmail = (email) => {
  if (!email) return 'Email is required'
  
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(email)) return 'Invalid email format'
  
  return null
}

// Validate password (enforces strength at submit)
export const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'

  const { score } = getPasswordStrength(password)
  if (score < 3) return 'Password too weak — mix uppercase, numbers & symbols'

  return null
}

// Validate phone number (Kenyan format)
export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required'
  
  const cleaned = phone.replace(/\D/g, '')
  
  if (!cleaned.match(/^(254|0)[17]\d{8}$/)) {
    return 'Invalid phone number format'
  }
  
  return null
}

// Validate required field
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`
  }
  return null
}

// Validate min length
export const validateMinLength = (value, minLength, fieldName = 'This field') => {
  if (value && value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`
  }
  return null
}

// Validate max length
export const validateMaxLength = (value, maxLength, fieldName = 'This field') => {
  if (value && value.length > maxLength) {
    return `${fieldName} must be less than ${maxLength} characters`
  }
  return null
}

// Validate form (returns object with field errors)
export const validateForm = (values, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field]
    const value = values[field]
    
    for (const rule of fieldRules) {
      const error = rule(value)
      if (error) {
        errors[field] = error
        break
      }
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// ─────────────────────────────────────────────────────────────
// 🔐 PASSWORD STRENGTH CHECKER
// ─────────────────────────────────────────────────────────────
export const getPasswordStrength = (password) => {
  const checks = {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number:    /[0-9]/.test(password),
    special:   /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  }

  const passed = Object.values(checks).filter(Boolean).length

  let score, label, color, percent

  if (!password)      { score=0; label='';            color='#1e3a5f'; percent=0   }
  else if (passed<=1) { score=1; label='Too Weak';    color='#ef4444'; percent=20  }
  else if (passed===2){ score=2; label='Weak';        color='#f97316'; percent=40  }
  else if (passed===3){ score=3; label='Fair';        color='#eab308'; percent=60  }
  else if (passed===4){ score=4; label='Strong';      color='#22c55e'; percent=80  }
  else                { score=5; label='Very Strong'; color='#0ea5e9'; percent=100 }

  return { score, label, color, percent, checks }
}