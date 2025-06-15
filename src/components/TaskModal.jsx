import React, { useState } from 'react';

const TaskModal = ({ site, onClose, onCreate }) => {
  const [title, setTitle] = useState(`Check ${site.kpi} at GeoID ${site.geoId}`);
  const [description, setDescription] = useState(
    `Investigate ${site.kpi} issue on site ${site.geoId} (eNodeB: ${site.enodeb}). Current value is ${site.value}.`
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = {
      id: Date.now(),
      title,
      description,
      siteId: site.id,
      createdAt: new Date().toISOString(),
    };
    onCreate(task);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 max-w-full bw">
        <h2 className="text-lg font-semibold mb-4">Create Network Task</h2>

        <div className="mb-3 text-sm bg-gray-100 p-2 rounded border">
          <p><strong>Geo ID:</strong> {site.geoId}</p>
          <p><strong>eNodeB:</strong> {site.enodeb}</p>
          <p><strong>Sector:</strong> {site.sector}, <strong>Carrier:</strong> {site.carrier}</p>
          <p><strong>KPI:</strong> {site.kpi} = {site.value}</p>
          <p><strong>Last Updated:</strong> {site.updatedAt || 'N/A'}</p>
          <p><strong>Severity:</strong> {site.severity || '—'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="border w-full p-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="border w-full p-2 rounded"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
