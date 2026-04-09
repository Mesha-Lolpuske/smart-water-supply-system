import { useState } from 'react';
import { MessageSquare, Send, AlertTriangle, CheckCircle, Droplets } from 'lucide-react';
import { smsService } from '../../services/smsService';

function SMSAlertPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState({
    type: 'emergency',
    title: '',
    message: '',
    zoneName: ''
  });
  const [result, setResult] = useState(null);

  const alertTypes = [
    { value: 'emergency', label: 'Emergency Alert', icon: AlertTriangle, color: 'red' },
    { value: 'water_back', label: 'Water Restored', icon: CheckCircle, color: 'green' },
    { value: 'water_cut', label: 'Water Cut', icon: Droplets, color: 'orange' },
    { value: 'maintenance', label: 'Maintenance', icon: AlertTriangle, color: 'yellow' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await smsService.sendBulkSMSAlert(alertData);
      setResult({
        success: true,
        message: `SMS alerts sent successfully to ${response.count} users`,
        details: response.smsResults
      });

      // Reset form on success
      setAlertData({
        type: 'emergency',
        title: '',
        message: '',
        zoneName: ''
      });
    } catch (error) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Failed to send SMS alerts'
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedType = alertTypes.find(type => type.value === alertData.type);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">SMS Alert System</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {isOpen ? 'Hide' : 'Show'} Panel
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4">
          {result && (
            <div className={`p-3 rounded-lg ${
              result.success
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <p className="font-medium">{result.message}</p>
              {result.details && (
                <p className="text-sm mt-1">
                  SMS: {result.details.successful} successful, {result.details.failed} failed
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {alertTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setAlertData({...alertData, type: type.value})}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition ${
                      alertData.type === type.value
                        ? `bg-${type.color}-50 border-${type.color}-200 text-${type.color}-800`
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <type.icon size={16} />
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zone/Area Name
              </label>
              <input
                type="text"
                required
                value={alertData.zoneName}
                onChange={(e) => setAlertData({...alertData, zoneName: e.target.value})}
                placeholder="e.g., Nairobi Central, Westlands"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alert Message
              </label>
              <textarea
                required
                rows={3}
                value={alertData.message}
                onChange={(e) => setAlertData({...alertData, message: e.target.value})}
                placeholder="Describe the water situation and any instructions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send SMS Alert
                </>
              )}
            </button>
          </form>

          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
            <p className="font-medium mb-1">SMS Alert Preview:</p>
            <p className="italic">
              "Hello [User], {selectedType?.label.toUpperCase()}: {alertData.message} in {alertData.zoneName || '[Zone]'}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SMSAlertPanel;