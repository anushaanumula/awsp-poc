import React from 'react';

const TaskList = ({ tasks, onRemove }) => {
  if (!tasks.length) {
    return <div className="p-4 border rounded">No tasks yet.</div>;
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-semibold mb-2">Task List</h2>
      <ul className="list-disc pl-6 space-y-1 text-sm">
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between">
            <span>{task.title}</span>
            <button
              onClick={() => onRemove(task.id)}
              className="text-red-600 hover:underline ml-2"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
