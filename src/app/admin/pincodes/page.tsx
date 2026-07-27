'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Check, Trash2, FileSpreadsheet } from 'lucide-react';

export default function AdminPincodes() {
  const [pincodes, setPincodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('delivery_pincodes');
    if (stored) {
      try {
        setPincodes(JSON.parse(stored));
      } catch(e) {}
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        // Parse CSV - simple regex to find 6 digit numbers
        const matches = csvText.match(/\b\d{6}\b/g);
        
        if (matches && matches.length > 0) {
          const uniquePincodes = Array.from(new Set([...pincodes, ...matches]));
          setPincodes(uniquePincodes);
          localStorage.setItem('delivery_pincodes', JSON.stringify(uniquePincodes));
          setMessage(`Successfully imported ${matches.length} pincodes. Total unique: ${uniquePincodes.length}`);
        } else {
          setMessage('No valid 6-digit pincodes found in the CSV file.');
        }
      } catch (error) {
        setMessage('Error reading file.');
      }
      setLoading(false);
      // Reset input
      e.target.value = '';
    };
    reader.onerror = () => {
      setMessage('Error reading file.');
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const clearPincodes = () => {
    if (confirm('Are you sure you want to clear all imported pincodes?')) {
      setPincodes([]);
      localStorage.removeItem('delivery_pincodes');
      setMessage('All pincodes cleared.');
    }
  };

  return (
    <div className="max-w-[800px] mx-auto p-6 min-h-screen pt-[120px]">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-black font-outfit text-gray-900 mb-2">Pincode Management</h1>
        <p className="text-gray-500 text-sm">Upload a CSV file containing pincodes to mark them as serviceable for delivery.</p>
      </div>

      <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><FileSpreadsheet className="w-5 h-5" /> Import CSV</h2>
        
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-brand-rose/40 rounded-sm p-10 bg-brand-cream/10 mb-4 hover:bg-brand-cream/30 transition-colors relative">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={loading}
          />
          <Upload className="w-8 h-8 text-brand-burgundy mb-3" />
          <p className="text-sm font-bold text-gray-700 mb-1">Click or drag CSV file to upload</p>
          <p className="text-xs text-gray-500">The system will automatically extract all 6-digit numbers</p>
        </div>

        {loading && <p className="text-sm font-bold text-brand-burgundy animate-pulse">Processing file...</p>}
        {message && (
          <div className={`p-3 rounded-sm text-sm font-medium ${message.includes('Error') || message.includes('No valid') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'} flex items-center gap-2`}>
            {message.includes('Successfully') && <Check className="w-4 h-4" />}
            {message}
          </div>
        )}
      </div>

      <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">Imported Pincodes <span className="bg-brand-cream px-2 py-0.5 text-xs rounded-full text-brand-burgundy ml-2">{pincodes.length}</span></h2>
          {pincodes.length > 0 && (
            <button 
              onClick={clearPincodes}
              className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          )}
        </div>

        {pincodes.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm italic">
            No pincodes imported yet. All 6-digit pincodes will be accepted by default on the product page.
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {pincodes.map((pin) => (
              <div key={pin} className="bg-gray-50 border border-gray-200 text-center py-1.5 text-xs font-bold text-gray-700 rounded-sm">
                {pin}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
