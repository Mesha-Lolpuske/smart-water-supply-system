// Format date
export const formatDate = (date) => {
  if (!date) return 'N/A'
  
  const d = new Date(date)
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return d.toLocaleDateString('en-US', options)
}

// Format time
export const formatTime = (date) => {
  if (!date) return 'N/A'
  
  const d = new Date(date)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// Format datetime
export const formatDateTime = (date) => {
  if (!date) return 'N/A'
  
  return `${formatDate(date)} at ${formatTime(date)}`
}

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  if (!date) return 'N/A'
  
  const now = new Date()
  const diff = now - new Date(date)
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 7) return formatDate(date)
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  return 'Just now'
}

// Get severity color
export const getSeverityColor = (severity) => {
  const colors = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    low: 'bg-green-100 text-green-700 border-green-200'
  }
  return colors[severity?.toLowerCase()] || colors.low
}

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-orange-100 text-orange-700',
    investigating: 'bg-blue-100 text-blue-700',
    resolved: 'bg-emerald-100 text-emerald-700',
    closed: 'bg-slate-100 text-slate-700',
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-slate-100 text-slate-700',
    scheduled: 'bg-blue-100 text-blue-700'
  }
  return colors[status?.toLowerCase()] || colors.pending
}

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  
  // Remove all non-digits
  const cleaned = ('' + phone).replace(/\D/g, '')
  
  // Format as +254 XXX XXX XXX
  if (cleaned.startsWith('254')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`
  }
  
  // Format as 0XXX XXX XXX
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  
  return phone
}

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?'
  
  const names = name.trim().split(' ')
  if (names.length === 1) return names[0].charAt(0).toUpperCase()
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

// Check if email is valid
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Format number with commas
export const formatNumber = (num) => {
  if (!num) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}