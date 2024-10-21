'use client';

import React, { useState, useEffect } from 'react';
import { format, parse, isValid } from 'date-fns';

export default function PracticalContent({ content, subject, isEditing, isLoading, onSubmit, onCancel }) {
  const [localContent, setLocalContent] = useState(content || []);
  const [error, setError] = useState('');
  const batches = subject?.batch || [];

  useEffect(() => {
    setLocalContent(content || []);
  }, [content]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = parse(dateString, 'dd/MM/yyyy', new Date());
    return isValid(date) ? date.toISOString().split('T')[0] : dateString; // Return in ISO format
  };

  const parseDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`; // Return in DD/MM/YYYY format
  };

  const handleContentChange = (index, field, value) => {
    const newContent = [...localContent];
    newContent[index][field] = field === 'proposedDate' ? formatDate(value) : value;
    setLocalContent(newContent);
  };

  const handleBatchStatusChange = (index, batchId, field, value) => {
    const newContent = [...localContent];
    if (!newContent[index].batchStatus) {
      newContent[index].batchStatus = [];
    }

    const batchStatusIndex = newContent[index].batchStatus.findIndex(bs => bs.batchId === batchId);

    if (batchStatusIndex === -1) {
      newContent[index].batchStatus.push({
        batchId,
        status: field === 'status' ? (value ? 'covered' : 'not_covered') : 'not_covered',
        completedDate: field === 'completedDate' ? formatDate(value) : ''
      });
    } else {
      if (field === 'status') {
        newContent[index].batchStatus[batchStatusIndex].status = value ? 'covered' : 'not_covered';
      } else if (field === 'completedDate') {
        newContent[index].batchStatus[batchStatusIndex].completedDate = formatDate(value);
      }
    }

    setLocalContent(newContent);
  };

  const handleAddContent = () => {
    setLocalContent([...localContent, {
      title: '',
      description: '',
      proposedDate: '',
      references: '',
      courseOutcomes: '',
      programOutcomes: '',
      batchStatus: batches.map(batchId => ({ batchId, status: 'not_covered', completedDate: '' }))
    }]);
  };

  const handleRemoveContent = (index) => {
    const newContent = [...localContent];
    newContent.splice(index, 1);
    setLocalContent(newContent);
  };

  const getBatchStatus = (item, batchId) => {
    const batchStatus = item.batchStatus?.find(bs => bs.batchId === batchId);
    return batchStatus || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localContent.length) {
      setError('Please add content before submitting.');
      return;
    }
    setError('');
    onSubmit(localContent);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;  // Graceful loader handling
  }

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr>
              <th className="border-b border-gray-200">Title</th>
              <th className="border-b border-gray-200">Description</th>
              <th className="border-b border-gray-200">Proposed Date</th>
              <th className="border-b border-gray-200">References</th>
              <th className="border-b border-gray-200">Course Outcomes</th>
              <th className="border-b border-gray-200">Program Outcomes</th>
              {batches.map((batchId) => (
                <th key={batchId} className="border-b border-gray-200">Batch {batchId}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {localContent.map((item, index) => (
              <tr key={index}>
                <td className="border-b border-gray-200">{item.title}</td>
                <td className="border-b border-gray-200">{item.description}</td>
                <td className="border-b border-gray-200">{parseDate(item.proposedDate)}</td>
                <td className="border-b border-gray-200">{item.references}</td>
                <td className="border-b border-gray-200">{item.courseOutcomes}</td>
                <td className="border-b border-gray-200">{item.programOutcomes}</td>
                {batches.map((batchId) => {
                  const batchStatus = getBatchStatus(item, batchId);
                  return (
                    <td key={batchId} className="border-b border-gray-200">
                      <div className="space-y-1">
                        <div>Status: {batchStatus?.status}</div>
                        <div>Completed: {parseDate(batchStatus?.completedDate)}</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {localContent.map((item, index) => (
        <div key={index} className="border p-4 mb-4">
          <h3 className="font-semibold">Content {index + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              className="border p-2 rounded"
              placeholder="Title"
              value={item.title}
              onChange={(e) => handleContentChange(index, 'title', e.target.value)}
              required
              disabled={isLoading}
            />
            <textarea
              className="border p-2 rounded"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleContentChange(index, 'description', e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              type="date"
              className="border p-2 rounded"
              value={item.proposedDate}
              onChange={(e) => handleContentChange(index, 'proposedDate', e.target.value)}
              disabled={isLoading}
            />
            <input
              type="text"
              className="border p-2 rounded"
              placeholder="References"
              value={item.references}
              onChange={(e) => handleContentChange(index, 'references', e.target.value)}
              disabled={isLoading}
            />
            <input
              type="text"
              className="border p-2 rounded"
              placeholder="Course Outcomes"
              value={item.courseOutcomes}
              onChange={(e) => handleContentChange(index, 'courseOutcomes', e.target.value)}
              disabled={isLoading}
            />
            <input
              type="text"
              className="border p-2 rounded"
              placeholder="Program Outcomes"
              value={item.programOutcomes}
              onChange={(e) => handleContentChange(index, 'programOutcomes', e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Batch Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {batches.map((batchId) => {
                const batchStatus = getBatchStatus(item, batchId);
                return (
                  <div key={batchId} className="border p-3">
                    <h5 className="font-medium mb-2">Batch {batchId}</h5>
                    <div className="space-y-2">
                      <label>
                        <input
                          type="checkbox"
                          checked={batchStatus?.status === 'covered'}
                          onChange={(e) => handleBatchStatusChange(index, batchId, 'status', e.target.checked)}
                          disabled={isLoading}
                        />
                        Covered
                      </label>
                      <input
                        type="date"
                        className="border p-2 rounded"
                        value={batchStatus?.completedDate || ''}
                        onChange={(e) => handleBatchStatusChange(index, batchId, 'completedDate', e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => handleRemoveContent(index)}
              disabled={isLoading}
            >
              Remove Content
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between">
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleAddContent}
          disabled={isLoading}
        >
          Add Content
        </button>
        <div className="space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
            disabled={isLoading}
          >
            Save
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </form>
  );
}