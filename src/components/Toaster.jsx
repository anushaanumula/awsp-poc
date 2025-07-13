import React, { useEffect, useState, createContext, useContext } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  XMarkIcon,
  CogIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Toaster = ({ toast, onClose, index = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case 'error':
        return <ExclamationCircleIcon className="w-6 h-6 text-red-600" />;
      case 'info':
        return <CogIcon className="w-6 h-6 text-verizon-blue" />;
      case 'processing':
        return <ClockIcon className="w-6 h-6 text-verizon-blue animate-spin" />;
      default:
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-300 shadow-green-100';
      case 'error':
        return 'bg-red-50 border-red-300 shadow-red-100';
      case 'info':
        return 'bg-blue-50 border-blue-300 shadow-blue-100';
      case 'processing':
        return 'bg-verizon-concrete border-verizon-blue shadow-blue-100';
      default:
        return 'bg-green-50 border-green-300 shadow-green-100';
    }
  };

  return (
    <div
      className={`max-w-sm w-full border-2 rounded-lg shadow-xl transition-all duration-500 mb-3 ${
        isVisible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'
      } ${getBgColor()}`}
      style={{
        minWidth: '320px'
      }}
    >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div className="ml-3 w-0 flex-1">
              <div className="text-sm font-medium text-gray-900">
                {toast.title}
              </div>
              {toast.message && (
                <div className="mt-1 text-sm text-gray-600">
                  {toast.message}
                </div>
              )}
              {toast.details && (
                <div className="mt-2 text-xs text-gray-500 bg-white p-3 rounded border">
                  {typeof toast.details === 'object' ? (
                    <div className="space-y-2">
                      <div className="pb-2 border-b border-gray-200">
                        <strong className="text-verizon-black">Action Details:</strong>
                      </div>
                      <div><strong>Action:</strong> <span className="text-gray-700">{toast.details.action}</span></div>
                      <div><strong>Priority:</strong> <span className="text-gray-700">{toast.details.inputs?.priority}</span></div>
                      <div><strong>Duration:</strong> <span className="text-gray-700">{toast.details.inputs?.duration}h</span></div>
                      {toast.details.site && (
                        <div><strong>Site:</strong> <span className="text-gray-700">{toast.details.site.geoId}</span></div>
                      )}
                      {toast.details.inputs?.notes && (
                        <div><strong>Notes:</strong> <span className="text-gray-700">{toast.details.inputs.notes}</span></div>
                      )}
                      <div className="pt-2 border-t border-gray-200">
                        <strong>Executed:</strong> <span className="text-gray-700">{new Date(toast.details.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-verizon-blue font-medium">
                        ✅ Agentic Workflow Completed
                      </div>
                    </div>
                  ) : (
                    toast.details
                  )}
                </div>
              )}
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

// Toaster Container Component  
const ToasterContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm pointer-events-none">
      {toasts.map((toast, index) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toaster
            toast={toast}
            index={index}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

// Toaster Provider Component
export const ToasterProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showToast = {
    success: (title, message, details) => addToast({ type: 'success', title, message, details }),
    error: (title, message, details) => addToast({ type: 'error', title, message, details }),
    info: (title, message, details) => addToast({ type: 'info', title, message, details }),
    processing: (title, message, details) => addToast({ type: 'processing', title, message, details, duration: 2000 })
  };

  return (
    <ToasterContext.Provider value={{ showToast }}>
      {children}
      {toasts.length > 0 && (
        <ToasterContainer toasts={toasts} removeToast={removeToast} />
      )}
    </ToasterContext.Provider>
  );
};

// Context for accessing toaster
export const ToasterContext = createContext();

export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within ToasterProvider');
  }
  return context;
};

export default Toaster;
