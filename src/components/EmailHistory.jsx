import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Mail, CheckCircle, XCircle, Clock, Eye } from "lucide-react";

export default function EmailHistory() {
  const [emailHistory, setEmailHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load email history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('emailHistory');
    if (savedHistory) {
      setEmailHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save email history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('emailHistory', JSON.stringify(emailHistory));
  }, [emailHistory]);

  // Function to add email to history (called from parent components)
  const addEmailToHistory = (emailData) => {
    const newEmail = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...emailData
    };
    setEmailHistory(prev => [newEmail, ...prev.slice(0, 49)]); // Keep only last 50 emails
  };

  // Expose the function globally so other components can use it
  useEffect(() => {
    window.addEmailToHistory = addEmailToHistory;
    return () => {
      delete window.addEmailToHistory;
    };
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Mail className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'Sent';
      case 'failed':
        return 'Failed';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all email history? This action cannot be undone.')) {
      setEmailHistory([]);
      localStorage.removeItem('emailHistory');
    }
  };

  if (!showHistory) {
    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Email History</h3>
            <p className="text-sm text-gray-600">
              {emailHistory.length} email{emailHistory.length !== 1 ? 's' : ''} sent
            </p>
          </div>
          <Button 
            onClick={() => setShowHistory(true)}
            variant="outline"
            size="sm"
          >
            <Eye className="mr-2 h-4 w-4" />
            View History
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Email History</h3>
          <p className="text-sm text-gray-600">
            {emailHistory.length} email{emailHistory.length !== 1 ? 's' : ''} sent
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={clearHistory}
            variant="outline"
            size="sm"
            disabled={emailHistory.length === 0}
          >
            Clear History
          </Button>
          <Button 
            onClick={() => setShowHistory(false)}
            variant="outline"
            size="sm"
          >
            Hide History
          </Button>
        </div>
      </div>

      {emailHistory.length === 0 ? (
        <div className="text-center py-8">
          <Mail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No email history</h3>
          <p className="mt-1 text-sm text-gray-500">
            Email history will appear here after you send emails.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {emailHistory.map((email) => (
            <div key={email.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(email.status)}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {email.vendorName} ({email.vendorId})
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(email.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(email.status)}`}>
                  {getStatusText(email.status)}
                </span>
                {email.message && (
                  <span className="text-xs text-gray-500 max-w-xs truncate">
                    {email.message}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 