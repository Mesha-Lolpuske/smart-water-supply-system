import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import technicianService from '../../../services/technicianService'
import { analyticsService } from '../../../services/analyticsService'
import DashboardLayout from '../../../layout/DashboardLayout'
import { useSearch } from '../../../context/SearchContext'
import { toast } from 'react-toastify'
import { njoroAreas, infrastructure } from '../../../utils/njoroData'

// Modular Components
import TechnicianHeader from './TechnicianHeader'
import TechnicianStatsGrid from './TechnicianStatsGrid'
import TechnicianMap from './TechnicianMap'
import TechnicianWorkOrders from './TechnicianWorkOrders'
import UpdateWorkOrderModal from './UpdateWorkOrderModal'

function TechnicianDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { searchQuery } = useSearch()
  
  const queryParams = new URLSearchParams(location.search)
  const isHistoryView = queryParams.get('view') === 'history'

  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedZone, setSelectedZone] = useState(null)
  const [mapLoading, setMapLoading] = useState(true)
  const [mapError, setMapError] = useState(null)
  const [dynamicStatuses, setDynamicStatuses] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [updateForm, setUpdateForm] = useState({
    status: '',
    notes: ''
  })

  useEffect(() => {
    fetchTechnicianData()
    fetchZoneStatus()
  }, [])

  const fetchZoneStatus = async () => {
    try {
      setRefreshing(true)
      const res = await analyticsService.getZoneStatus()
      if (res.success) {
        setDynamicStatuses(res.data)
      }
    } catch (error) {
      console.error('Error fetching zone status:', error)
      setMapError('Failed to sync live status')
    } finally {
      setRefreshing(false)
      setMapLoading(false)
    }
  }

  const mergedZones = useMemo(() => {
    return njoroAreas.map(area => {
      const dynamic = dynamicStatuses.find(d => d.name === area.name)
      return {
        ...area,
        status: dynamic ? dynamic.status : 'good', // Fallback to good
        reason: dynamic ? dynamic.reason : 'System operational - All clear',
        reportCount: dynamic ? dynamic.reportCount : 0,
        activeSchedules: dynamic ? dynamic.activeSchedules : 0
      }
    })
  }, [dynamicStatuses])

  const fetchTechnicianData = async () => {
    try {
      setLoading(true)
      const res = await technicianService.getAssignedReports()
      if (res.success) {
        setReports(res.reports)
      }
    } catch (error) {
      console.error('Error fetching technician data:', error)
      toast.error('Failed to load work orders')
    } finally {
      setLoading(false)
    }
  }

  const getZoneStatusColor = (status) => {
    switch (status) {
      case 'good': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getZoneStatusText = (status) => {
    switch (status) {
      case 'good': return 'Normal Supply';
      case 'warning': return 'Low Pressure / Leak / Rationing';
      case 'critical': return 'No Water / Contamination / Emergency';
      default: return 'Unknown';
    }
  };

  const getInfrastructureIcon = (type) => {
    switch (type) {
      case 'treatment': return '🏭';
      case 'pump': return '⚙️';
      case 'reservoir': return '💧';
      default: return '📍';
    }
  };

  const getInfrastructureColor = (status) => {
    switch (status) {
      case 'operational': return '#10b981';
      case 'maintenance': return '#f59e0b';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleOpenUpdate = (report) => {
    setSelectedReport(report)
    setUpdateForm({
      status: report.status === 'Fixed' || report.status === 'Resolved' ? report.status : 'In Progress',
      notes: report.technicianNotes || ''
    })
    setShowUpdateModal(true)
  }

  const handleUpdateSubmit = async () => {
    try {
      const res = await technicianService.updateReportStatus(
        selectedReport._id, 
        updateForm.status, 
        updateForm.notes
      )
      if (res.success) {
        toast.success('Work order updated successfully')
        setShowUpdateModal(false)
        fetchTechnicianData()
        
        // ✅ Dispatch event to refresh map
        window.dispatchEvent(new CustomEvent('reportStatusChanged', { 
          detail: { id: selectedReport._id, status: updateForm.status } 
        }));
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update work order')
    }
  }

  const filteredReports = useMemo(() => {
    const query = (searchQuery || '').toLowerCase().trim()
    const baseReports = isHistoryView 
      ? reports.filter(r => r.status === 'Fixed' || r.status === 'Resolved' || r.status === 'Cancelled')
      : reports.filter(r => r.status !== 'Fixed' && r.status !== 'Resolved' && r.status !== 'Cancelled')
    
    if (!query) return baseReports
    return baseReports.filter(report => 
      report.title.toLowerCase().includes(query) ||
      report.ward?.toLowerCase().includes(query) ||
      report.specificLocation?.toLowerCase().includes(query) ||
      report.status.toLowerCase().includes(query)
    )
  }, [reports, searchQuery, isHistoryView])

  const stats = useMemo(() => {
    return {
      total: reports.length,
      pending: reports.filter(r => ['Reported', 'Technician Assigned', 'In Progress'].includes(r.status)).length,
      resolved: reports.filter(r => ['Fixed', 'Resolved'].includes(r.status)).length,
      critical: reports.filter(r => r.severity === 'critical' && !['Fixed', 'Resolved'].includes(r.status)).length
    }
  }, [reports])

  const getRelativeTime = (date) => {
    const now = new Date()
    const created = new Date(date)
    const diffMs = now - created
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-red-50 text-red-600 border-red-100'
      case 'high': return 'bg-orange-50 text-orange-600 border-orange-100'
      case 'medium': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'low': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      default: return 'bg-slate-50 text-slate-600 border-slate-100'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Reported': return 'bg-orange-100 text-orange-700'
      case 'Technician Assigned': return 'bg-blue-100 text-blue-700'
      case 'In Progress': return 'bg-sky-100 text-sky-700'
      case 'Fixed': case 'Resolved': return 'bg-emerald-100 text-emerald-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="w-16 h-16 border-t-4 border-blue-900 rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-bold text-blue-950 animate-pulse">Accessing Field Portal...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <TechnicianHeader isHistoryView={isHistoryView} />

      {!isHistoryView && (
        <>
          <TechnicianMap 
            mapLoading={mapLoading}
            mapError={mapError}
            mergedZones={mergedZones}
            infrastructure={infrastructure}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            getZoneStatusColor={getZoneStatusColor}
            getZoneStatusText={getZoneStatusText}
            getInfrastructureIcon={getInfrastructureIcon}
            getInfrastructureColor={getInfrastructureColor}
            setMapLoading={setMapLoading}
          />
          <TechnicianStatsGrid stats={stats} />
        </>
      )}

      <TechnicianWorkOrders 
        isHistoryView={isHistoryView}
        filteredReports={filteredReports}
        navigate={navigate}
        handleOpenUpdate={handleOpenUpdate}
        getSeverityColor={getSeverityColor}
        getStatusColor={getStatusColor}
        getRelativeTime={getRelativeTime}
      />

      <UpdateWorkOrderModal 
        showUpdateModal={showUpdateModal}
        setShowUpdateModal={setShowUpdateModal}
        updateForm={updateForm}
        setUpdateForm={setUpdateForm}
        handleUpdateSubmit={handleUpdateSubmit}
      />
    </DashboardLayout>
  )
}

export default TechnicianDashboard
