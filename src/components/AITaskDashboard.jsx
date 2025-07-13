import React, { useState, useMemo, useEffect } from 'react';
import ActionModal from './ActionModal';
import { useToaster } from './Toaster';
import {
  CpuChipIcon,
  SparklesIcon,
  BoltIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  EyeIcon,
  CogIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserGroupIcon,
  CalendarIcon,
  BeakerIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AI_TASK_ENGINE = {
  generateInsights: (tasks) => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const critical = tasks.filter(t => t.priority === 'critical').length;
    
    return {
      completion: {
        rate: total > 0 ? Math.round((completed / total) * 100) : 0,
        trend: Math.random() > 0.5 ? 'improving' : 'stable',
        total,
        completed,
        pending,
        inProgress
      },
      performance: {
        avgResolutionTime: Math.round(Math.random() * 12 + 2), // 2-14 hours
        slaCompliance: Math.round(Math.random() * 20 + 80), // 80-100%
        escalationRate: Math.round(Math.random() * 10 + 2) // 2-12%
      },
      predictions: {
        nextHourTasks: Math.round(Math.random() * 5 + 2),
        riskOfDelays: Math.random() > 0.7 ? 'High' : 'Low',
        resourceNeeded: Math.random() > 0.6 ? 'Additional' : 'Current'
      },
      recommendations: [
        {
          type: 'Optimization',
          action: 'Auto-prioritize critical site outages',
          impact: 'Reduce MTTR by 25%',
          confidence: 92,
          urgency: 'High'
        },
        {
          type: 'Resource',
          action: 'Deploy additional RF engineers to high-impact markets',
          impact: 'Increase task throughput by 30%',
          confidence: 87,
          urgency: 'Medium'
        },
        {
          type: 'Automation',
          action: 'Enable auto-remediation for routine optimization tasks',
          impact: 'Free up 40% engineer time for complex issues',
          confidence: 95,
          urgency: 'High'
        }
      ]
    };
  },

  categorizeTask: (task) => {
    const categories = ['Critical Outage', 'Performance Optimization', 'Preventive Maintenance', 'Capacity Expansion'];
    return categories[Math.floor(Math.random() * categories.length)];
  },

  predictImpact: (task) => {
    const impacts = [
      { users: Math.round(Math.random() * 5000 + 1000), revenue: Math.round(Math.random() * 50000 + 10000) },
      { users: Math.round(Math.random() * 10000 + 2000), revenue: Math.round(Math.random() * 100000 + 20000) },
      { users: Math.round(Math.random() * 3000 + 500), revenue: Math.round(Math.random() * 30000 + 5000) }
    ];
    return impacts[Math.floor(Math.random() * impacts.length)];
  }
};

const AITaskDashboard = ({ tasks, onRemove, onUpdateTask, onAddTask, stateFilter }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [autoMode, setAutoMode] = useState(false);
  
  // Action Modal state
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    action: '',
    actionType: 'optimization',
    task: null
  });
  
  // Auto-completion timers for in-progress tasks
  const [autoCompletionTimers, setAutoCompletionTimers] = useState(new Map());
  
  const { showToast } = useToaster();
  
  // Generate AI insights
  const aiInsights = useMemo(() => {
    return AI_TASK_ENGINE.generateInsights(tasks);
  }, [tasks]);

  // Filter tasks by category
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    if (selectedCategory !== 'All') {
      // Map category to task attributes
      const categoryMappings = {
        'Critical': (task) => task.priority === 'critical',
        'High Priority': (task) => task.priority === 'high',
        'Optimization': (task) => task.title.toLowerCase().includes('optim'),
        'Maintenance': (task) => task.title.toLowerCase().includes('maintenance') || task.title.toLowerCase().includes('remediate'),
      };
      
      if (categoryMappings[selectedCategory]) {
        filtered = filtered.filter(categoryMappings[selectedCategory]);
      }
    }
    
    return filtered;
  }, [tasks, selectedCategory]);

  // Task status counts
  const statusCounts = useMemo(() => {
    return {
      pending: filteredTasks.filter(t => t.status === 'pending').length,
      'in-progress': filteredTasks.filter(t => t.status === 'in-progress').length,
      completed: filteredTasks.filter(t => t.status === 'completed').length,
      total: filteredTasks.length
    };
  }, [filteredTasks]);

  // Auto-execution simulation
  useEffect(() => {
    if (autoMode) {
      const interval = setInterval(() => {
        // Simulate AI making progress on tasks
        const pendingTasks = tasks.filter(t => t.status === 'pending');
        if (pendingTasks.length > 0 && Math.random() > 0.7) {
          const randomTask = pendingTasks[Math.floor(Math.random() * pendingTasks.length)];
          showToast.info(
            '🤖 AI Agent Update',
            `Automated progress on: ${randomTask.title}`,
            { taskId: randomTask.id, status: 'automated_progress' }
          );
        }
      }, 15000); // Every 15 seconds

      return () => clearInterval(interval);
    }
  }, [autoMode, tasks, showToast]);

  // Auto-completion for in-progress tasks
  useEffect(() => {
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const newTimers = new Map();
    
    // Start timers for new in-progress tasks
    inProgressTasks.forEach(task => {
      if (!autoCompletionTimers.has(task.id)) {
        const randomDelay = Math.random() * 30000 + 30000; // 30s to 1min
        const timerId = setTimeout(() => {
          // Auto-complete the task
          onUpdateTask(task.id, { status: 'completed' });
          showToast.success(
            '🤖 Auto-Completed',
            `Task "${task.title}" has been automatically completed by AI workflow`,
            { 
              taskId: task.id, 
              autoCompleted: true,
              completionTime: new Date().toLocaleTimeString()
            }
          );
        }, randomDelay);
        
        newTimers.set(task.id, timerId);
        
        showToast.info(
          '⏱️ Auto-Completion Scheduled',
          `Task "${task.title}" will auto-complete in ${Math.round(randomDelay/1000)}s`,
          { taskId: task.id, scheduledDelay: randomDelay }
        );
      }
    });
    
    // Clear timers for tasks no longer in progress
    autoCompletionTimers.forEach((timerId, taskId) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task || task.status !== 'in-progress') {
        clearTimeout(timerId);
      } else {
        newTimers.set(taskId, timerId);
      }
    });
    
    setAutoCompletionTimers(newTimers);
  }, [tasks.map(t => `${t.id}-${t.status}`).join(''), onUpdateTask, showToast]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      autoCompletionTimers.forEach(timerId => clearTimeout(timerId));
    };
  }, []);

  // Action handlers
  const openActionModal = (action, actionType, task) => {
    setActionModal({
      isOpen: true,
      action,
      actionType,
      task
    });
  };

  const closeActionModal = () => {
    setActionModal({
      isOpen: false,
      action: '',
      actionType: 'optimization',
      task: null
    });
  };

  const executeAction = (actionDetails) => {
    showToast.processing(
      '🔄 Executing Agentic Action',
      'Deploying AI agents to downstream systems...'
    );

    setTimeout(() => {
      showToast.success(
        '✅ Agentic Workflow Completed',
        'AI agents have successfully executed the task in downstream systems',
        actionDetails
      );
      
      // Move task from pending to in-progress if it was an execution
      if (actionDetails.task && actionDetails.task.status === 'pending') {
        onUpdateTask(actionDetails.task.id, { status: 'in-progress' });
      }
    }, 2000);
  };

  // Create AI workflow task (for AI Insights actions)
  const createAIWorkflowTask = (action, details) => {
    const taskId = `ai-workflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newTask = {
      id: taskId,
      title: `AI Workflow: ${action}`,
      description: details.description || `Automated ${action} workflow triggered from AI Insights`,
      priority: details.priority || 'high',
      status: 'in-progress', // Start directly in progress
      site: details.site || 'AI System',
      market: details.market || 'Automated',
      category: 'AI Workflow',
      estimatedDuration: details.estimatedDuration || '30-60 seconds',
      createdAt: new Date().toISOString(),
      aiWorkflow: true,
      workflowType: action.toLowerCase()
    };

    // Add the task via parent component
    if (typeof onAddTask === 'function') {
      onAddTask(newTask);
      showToast.success(
        '🤖 AI Workflow Created',
        `${action} workflow has been initiated and will auto-complete soon`,
        { newTask, aiWorkflow: true }
      );
    }

    return newTask;
  };

  // Execute task (move from pending to in-progress)
  const executeTask = (task) => {
    onUpdateTask(task.id, { status: 'in-progress' });
    showToast.success(
      '▶️ Task Executed',
      `Task "${task.title}" has been started and moved to In Progress`
    );
  };

  // Cancel task (move from in-progress back to pending)
  const cancelTask = (task) => {
    onUpdateTask(task.id, { status: 'pending' });
    showToast.info(
      '⏸️ Task Cancelled',
      `Task "${task.title}" has been cancelled and moved back to Pending`
    );
  };

  // Complete task (move from in-progress to completed)
  const completeTask = (task) => {
    onUpdateTask(task.id, { status: 'completed' });
    showToast.success(
      '✅ Task Completed',
      `Task "${task.title}" has been completed successfully`
    );
  };

  // Reopen task (move from completed back to pending)
  const reopenTask = (task) => {
    onUpdateTask(task.id, { status: 'pending' });
    showToast.info(
      '🔄 Task Reopened',
      `Task "${task.title}" has been moved back to Pending`
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-verizon-red text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-verizon-blue text-white';
      case 'low': return 'bg-gray-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (!tasks.length) {
    return (
      <div className="space-y-6">
        {/* Empty State */}
        <div className="text-center py-12 bg-white border-2 border-verizon-black rounded-lg">
          <RocketLaunchIcon className="w-16 h-16 mx-auto mb-4 text-verizon-blue" />
          <h3 className="text-xl font-semibold text-verizon-black mb-2">AI Task Intelligence Ready</h3>
          <p className="text-gray-600 mb-6">No active tasks found. Tasks will appear here when created from the KPI dashboard or AI Insights.</p>
          
          <div className="text-sm text-gray-500">
            <p><strong>Workflow:</strong> Pending → In Progress → Completed</p>
            <p>Create tasks from the Live Map & KPI or AI Insights tabs</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex justify-between items-center bg-verizon-concrete p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-4 h-4 text-verizon-black" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-verizon-black rounded px-3 py-1 text-sm bg-white"
            >
              <option value="All">All Tasks</option>
              <option value="Critical">Critical Priority</option>
              <option value="High Priority">High Priority</option>
              <option value="Optimization">Optimization Tasks</option>
              <option value="Maintenance">Maintenance Tasks</option>
            </select>
          </div>
        </div>
        
        <div className="text-sm text-verizon-black">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-3 gap-6">
        {/* Pending Column */}
        <div className="bg-white border-2 border-verizon-black rounded-lg">
          <div className="p-4 border-b-2 border-yellow-300 bg-yellow-50">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-verizon-black flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-yellow-600" />
                Pending
              </h3>
              <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm font-semibold">
                {statusCounts.pending}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Tasks awaiting execution</p>
          </div>
          <div className="p-4 space-y-3 min-h-96 bg-yellow-25">
            {filteredTasks.filter(t => t.status === 'pending').map((task) => (
              <div key={task.id} className="border-2 border-yellow-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority?.toUpperCase()}
                  </span>
                  <button
                    onClick={() => onRemove(task.id)}
                    className="text-gray-400 hover:text-red-500 text-xs"
                  >
                    ✕
                  </button>
                </div>
                
                <h4 className="font-semibold text-sm text-verizon-black mb-1 line-clamp-2">{task.title}</h4>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                
                <div className="text-xs text-gray-500 mb-3">
                  <div>Site: <span className="font-medium">{task.siteId}</span></div>
                  <div>Assignee: <span className="font-medium">{task.assignee}</span></div>
                </div>
                
                <div className="text-xs">
                  <button 
                    onClick={() => executeTask(task)}
                    className="w-full px-2 py-1.5 bg-verizon-red text-white rounded hover:bg-red-700 flex items-center justify-center"
                    title="Execute task manually"
                  >
                    <PlayIcon className="w-3 h-3 mr-1" />
                    Execute
                  </button>
                </div>
              </div>
            ))}
            {statusCounts.pending === 0 && (
              <div className="text-center py-8 text-gray-400">
                <CheckCircleIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No pending tasks</p>
              </div>
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-white border-2 border-verizon-black rounded-lg">
          <div className="p-4 border-b-2 border-blue-300 bg-blue-50">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-verizon-black flex items-center">
                <CogIcon className="w-5 h-5 mr-2 text-blue-600" />
                In Progress
              </h3>
              <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
                {statusCounts['in-progress']}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Tasks being executed</p>
          </div>
          <div className="p-4 space-y-3 min-h-96 bg-blue-25">
            {filteredTasks.filter(t => t.status === 'in-progress').map((task) => (
              <div key={task.id} className="border-2 border-blue-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority?.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-600 font-medium">Active</span>
                  </div>
                </div>
                
                <h4 className="font-semibold text-sm text-verizon-black mb-1 line-clamp-2">{task.title}</h4>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                
                <div className="text-xs text-gray-500 mb-3">
                  <div>Site: <span className="font-medium">{task.siteId}</span></div>
                  <div>Assignee: <span className="font-medium">{task.assignee}</span></div>
                </div>
                
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <button 
                    onClick={() => cancelTask(task)}
                    className="px-2 py-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 flex items-center justify-center"
                    title="Cancel task and move back to pending"
                  >
                    <PauseIcon className="w-3 h-3 mr-1" />
                    Cancel
                  </button>
                  <button 
                    onClick={() => reopenTask(task)}
                    className="px-2 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center justify-center"
                    title="Restore to pending"
                  >
                    <ArrowPathIcon className="w-3 h-3 mr-1" />
                    Restore
                  </button>
                </div>
              </div>
            ))}
            {statusCounts['in-progress'] === 0 && (
              <div className="text-center py-8 text-gray-400">
                <ArrowRightIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No tasks in progress</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Column */}
        <div className="bg-white border-2 border-verizon-black rounded-lg">
          <div className="p-4 border-b-2 border-green-300 bg-green-50">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-verizon-black flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                Completed
              </h3>
              <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                {statusCounts.completed}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Successfully completed tasks</p>
          </div>
          <div className="p-4 space-y-3 min-h-96 bg-green-25">
            {filteredTasks.filter(t => t.status === 'completed').map((task) => (
              <div key={task.id} className="border-2 border-green-200 rounded-lg p-3 bg-white hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority?.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">Done</span>
                  </div>
                </div>
                
                <h4 className="font-semibold text-sm text-verizon-black mb-1 line-clamp-2">{task.title}</h4>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                
                <div className="text-xs text-gray-500 mb-3">
                  <div>Site: <span className="font-medium">{task.siteId}</span></div>
                  <div>Completed by: <span className="font-medium">{task.assignee}</span></div>
                </div>
                
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <button 
                    onClick={() => reopenTask(task)}
                    className="px-2 py-1.5 bg-verizon-blue text-white rounded hover:bg-blue-700 flex items-center justify-center"
                    title="Reopen task"
                  >
                    <ArrowPathIcon className="w-3 h-3 mr-1" />
                    Reopen
                  </button>
                  <button
                    onClick={() => onRemove(task.id)}
                    className="px-2 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                    title="Archive task"
                  >
                    <XMarkIcon className="w-3 h-3 mr-1" />
                    Archive
                  </button>
                </div>
              </div>
            ))}
            {statusCounts.completed === 0 && (
              <div className="text-center py-8 text-gray-400">
                <ClockIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No completed tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Modal */}
      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={closeActionModal}
        action={actionModal.action}
        actionType={actionModal.actionType}
        site={actionModal.task}
        onExecute={executeAction}
      />
    </div>
  );
};

export default AITaskDashboard;
