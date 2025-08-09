import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SandeshAi = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [filePath, setFilePath] = useState('');
  const [files, setFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filesLoading, setFilesLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = 'http://localhost:8080';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchFiles = async () => {
      setFilesLoading(true);
      try {
        const response = await axios.get(`${API_URL}/list-files`);
        setFiles(response.data.files);
      } catch (err) {
        setError(`Failed to load files: ${err.message}`);
      } finally {
        setFilesLoading(false);
      }
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!query.trim()) {
      setError('Please enter an instruction.');
      return;
    }
    if (!filePath) {
      setError('Please select a file to modify.');
      return;
    }
    if (query.length > 300) {
      setError('Instruction is too long (max 300 characters).');
      return;
    }
    if (!filePath.match(/\.(js|jsx|ts|tsx)$/)) {
      setError('Invalid file path. Only .js, .jsx, .ts, .tsx files are allowed.');
      return;
    }

    const newUserMessage = { role: 'user', content: `Modify ${filePath}: ${query}` };
    setMessages([...messages, newUserMessage]);
    setQuery('');
    setFilePath('');
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/modify-code`, {
        filePath,
        instruction: query,
      });

      const answer = [{
        role: 'assistant',
        content: response.data.success
          ? `${response.data.message}\n\nModified code:\n${response.data.modifiedCode}`
          : `Error: ${response.data.error}\nDetails: ${response.data.details}`,
      }];

      setMessages((prev) => [...prev, ...answer]);
    } catch (err) {
      const errorMessage = err.response?.data?.details || err.message;
      setError(`Failed to modify code: ${errorMessage}`);
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${errorMessage}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 flex flex-col h-[80vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sandesh AI Code Modifier</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ×
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select File to Modify</label>
          <select
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            className="mt-1 p-2 w-full border rounded"
            disabled={loading || filesLoading}
          >
            <option value="">{filesLoading ? 'Loading files...' : 'Select a file'}</option>
            {files.map((file) => (
              <option key={file} value={file}>{file}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-100 text-blue-900 ml-10' : 'bg-green-100 text-green-900 mr-10'
              }`}
            >
              <strong>{msg.role === 'user' ? 'You' : 'Ilamely Kanxo'}:</strong> {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex gap-2">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 border rounded resize-none"
            placeholder="Type your code modification instruction..."
            rows="3"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SandeshAi;