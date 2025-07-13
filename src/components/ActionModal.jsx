import React, { useState } from 'react';
import { 
  XMarkIcon, 
  CogIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const ActionModal = ({ 
  isOpen, 
  onClose, 
  action, 
  actionType = 'optimization', // 'optimization', 'automation', 'emergency'
  site = null,
  onExecute 
}) => {
  const [inputs, setInputs] = useState({
    priority: 'Medium',
    duration: '1',
    impact: 'Low',
    approver: '',
    notes: '',
    confirmDownstream: false
  });

  const [isExecuting, setIsExecuting] = useState(false);

  if (!isOpen) return null;

  const handleExecute = async () => {
    setIsExecuting(true);
    
    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Call the execute function with action details
    if (onExecute) {
      onExecute({
        action,
        site,
        inputs,
        timestamp: new Date().toISOString()
      });
    }
    
    setIsExecuting(false);
    onClose();
  };

  const getActionIcon = () => {
    switch (actionType) {
      case 'automation':
        return <CogIcon className="w-6 h-6 text-verizon-blue" />;
      case 'emergency':
        return <ExclamationTriangleIcon className="w-6 h-6 text-verizon-red" />;
      default:
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
    }
  };

  const getActionColor = () => {
    switch (actionType) {
      case 'automation':
        return 'border-verizon-blue';
      case 'emergency':
        return 'border-verizon-red';
      default:
        return 'border-green-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className={`p-4 border-b ${getActionColor()}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getActionIcon()}
              <div>
                <h3 className="text-lg font-semibold text-verizon-black">
                  Execute AI Action
                </h3>
                <p className="text-sm text-gray-600">
                  {site ? `Site: ${site.geoId}` : 'Market-level action'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Action Description */}
          <div className="bg-verizon-concrete p-3 rounded-lg">
            <h4 className="font-medium text-verizon-black mb-1">Action to Execute:</h4>
            <p className="text-sm text-gray-700">{action}</p>
          </div>

          {/* Configuration Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-verizon-black mb-1">
                Priority
              </label>
              <select
                value={inputs.priority}
                onChange={(e) => setInputs(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-verizon-blue focus:border-verizon-blue"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-verizon-black mb-1">
                Duration (hours)
              </label>
              <input
                type="number"
                min="0.5"
                max="24"
                step="0.5"
                value={inputs.duration}
                onChange={(e) => setInputs(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-verizon-blue focus:border-verizon-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-verizon-black mb-1">
                Expected Impact
              </label>
              <select
                value={inputs.impact}
                onChange={(e) => setInputs(prev => ({ ...prev, impact: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-verizon-blue focus:border-verizon-blue"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-verizon-black mb-1">
                <UserIcon className="w-4 h-4 inline mr-1" />
                Approver ID
              </label>
              <input
                type="text"
                placeholder="e.g., RF_ENG_001"
                value={inputs.approver}
                onChange={(e) => setInputs(prev => ({ ...prev, approver: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-verizon-blue focus:border-verizon-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-verizon-black mb-1">
              <DocumentTextIcon className="w-4 h-4 inline mr-1" />
              Additional Notes
            </label>
            <textarea
              rows="3"
              placeholder="Optional notes for this action..."
              value={inputs.notes}
              onChange={(e) => setInputs(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-verizon-blue focus:border-verizon-blue"
            />
          </div>

          {/* Confirmation */}
          <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <input
              type="checkbox"
              id="confirmDownstream"
              checked={inputs.confirmDownstream}
              onChange={(e) => setInputs(prev => ({ ...prev, confirmDownstream: e.target.checked }))}
              className="rounded text-verizon-blue focus:ring-verizon-blue"
            />
            <label htmlFor="confirmDownstream" className="text-sm text-gray-700">
              I confirm this action will be executed via Agentic workflow in downstream systems
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            disabled={!inputs.confirmDownstream || isExecuting}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md flex items-center space-x-2 ${
              !inputs.confirmDownstream || isExecuting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-verizon-red hover:bg-red-700'
            }`}
          >
            {isExecuting ? (
              <>
                <ClockIcon className="w-4 h-4 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <CogIcon className="w-4 h-4" />
                <span>Execute Action</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
