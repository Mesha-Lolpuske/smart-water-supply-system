// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Report Status
export const REPORT_STATUS = {
  PENDING: 'pending',
  INVESTIGATING: 'investigating',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
}

// Report Severity
export const REPORT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

// Schedule Status
export const SCHEDULE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed'
}

// Announcement Types
export const ANNOUNCEMENT_TYPES = {
  GENERAL: 'general',
  MAINTENANCE: 'maintenance',
  ALERT: 'alert',
  SCHEDULE: 'schedule',
  OTHER: 'other'
}

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}

// Notification Types
export const NOTIFICATION_TYPES = {
  UPDATE: 'update',
  REPORT: 'report',
  MAINTENANCE: 'maintenance',
  ALERT: 'alert',
  SYSTEM: 'system',
  USER: 'user',
  SCHEDULE: 'schedule'
}

// Zones
export const ZONES = [
  'Westlands',
  'Kilimani',
  'CBD',
  'Karen',
  'Lavington',
  'Parklands'
]

// Days of Week
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]