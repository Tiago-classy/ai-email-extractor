import React, { useState, useRef } from 'react';
import { UploadCloudIcon, LinkIcon } from './icons';

interface InputFormProps {
  onSubmitUrl: (url: string) => void;
  onSubmitFile: (file: File) => void;
  isLoading: boolean;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-colors ${
            active 
                ? 'bg-purple-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
        }`}
    >
        {children}
    </button>
);


export const InputForm: React.FC<InputFormProps> = ({ onSubmitUrl, onSubmitFile, isLoading }) => {
  const [inputType, setInputType] = useState<'url' | 'csv'>('url');
  
  // State for URL input
  const [url, setUrl] = useState('');
  
  // State and ref for CSV input
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      onSubmitUrl(url);
    }
  };

  const handleCsvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onSubmitFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "text/csv") {
        setSelectedFile(file);
    }
  };

  return (
    <div className="space-y-4">
        <div className="flex space-x-2 p-1 bg-gray-900/50 rounded-lg border border-gray-700 w-min">
            <TabButton active={inputType === 'url'} onClick={() => setInputType('url')}>Single URL</TabButton>
            <TabButton active={inputType === 'csv'} onClick={() => setInputType('csv')}>CSV Upload</TabButton>
        </div>

        {inputType === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading || !url}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-all duration-300 disabled:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <LinkIcon className="w-5 h-5" />
                                <span>Extract from URL</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        )}

        {inputType === 'csv' && (
            <form onSubmit={handleCsvSubmit} className="space-y-4">
                <label 
                    htmlFor="csv-upload" 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="flex justify-center w-full h-32 px-4 transition bg-gray-700/50 border-2 border-gray-600 border-dashed rounded-md appearance-none cursor-pointer hover:border-purple-400 focus:outline-none"
                >
                    <span className="flex items-center space-x-2">
                        <UploadCloudIcon className="w-6 h-6 text-gray-400" />
                        <span className="font-medium text-gray-400">
                            {selectedFile ? `File: ${selectedFile.name}` : 'Drop a .csv file, or click to select'}
                        </span>
                    </span>
                    <input 
                        id="csv-upload" 
                        type="file" 
                        accept=".csv" 
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden" 
                    />
                </label>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading || !selectedFile}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-all duration-300 disabled:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                    {isLoading ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                        </>
                    ) : (
                        <>
                        <UploadCloudIcon className="w-5 h-5" />
                        <span>Extract from CSV</span>
                        </>
                    )}
                    </button>
                </div>
            </form>
        )}
    </div>
  );
};