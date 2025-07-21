import React, { useState, useCallback } from 'react';
import { InputForm } from './components/URLInputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { extractEmailsFromUrl } from './services/geminiService';
import { GithubIcon } from './components/icons';

export interface ResultItem {
    status: 'success';
    emails: string[];
}
  
export interface ErrorItem {
    status: 'error';
    message: string;
}
  
export type Result = Record<string, ResultItem | ErrorItem>;


const App: React.FC = () => {
  const [results, setResults] = useState<Result>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCrawled, setIsCrawled] = useState(false);
  const [sourceName, setSourceName] = useState('');

  const handleUrlSubmit = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResults({});
    setIsCrawled(true);
    setSourceName(url);

    try {
        const emails = await extractEmailsFromUrl(url);
        setResults({ [url]: { status: 'success', emails } });
    } catch (err) {
        setResults({ [url]: { status: 'error', message: (err as Error).message }});
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleFileSubmit = useCallback(async (file: File) => {
    if (!file) {
        setError("Please select a file.");
        return;
    }
    if (!file.name.endsWith('.csv')) {
        setError("Invalid file type. Please upload a .csv file.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setResults({});
    setIsCrawled(true);
    setSourceName(file.name);

    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
        const fileContent = event.target?.result as string;
        // Parse URLs from CSV (first column), handling different line endings
        const urls = fileContent.split(/\r?\n/)
            .map(line => line.split(',')[0].trim().replace(/"/g, ''))
            .filter(url => url && (url.startsWith('http://') || url.startsWith('https://')));

        if (urls.length === 0) {
            setError("No valid URLs found in the CSV file.");
            setIsLoading(false);
            return;
        }

        const settledResults = await Promise.allSettled(
            urls.map(url => extractEmailsFromUrl(url))
        );

        const newResults: Result = {};

        settledResults.forEach((result, index) => {
            const url = urls[index];
            if (result.status === 'fulfilled') {
                newResults[url] = { status: 'success', emails: result.value };
            } else {
                newResults[url] = { status: 'error', message: (result.reason as Error).message };
            }
        });
        
        setResults(newResults);
        setIsLoading(false);
    };

    fileReader.onerror = () => {
        setError("Failed to read the file.");
        setIsLoading(false);
    };

    fileReader.readAsText(file);

  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            AI Email Extractor
          </h1>
          <p className="text-gray-400 mt-2">
            Enter a URL or upload a CSV to let our AI find email addresses for you.
          </p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl shadow-purple-500/10 border border-gray-700 p-6 md:p-8">
          <InputForm
            onSubmitUrl={handleUrlSubmit}
            onSubmitFile={handleFileSubmit}
            isLoading={isLoading}
          />
          <div className="mt-8">
            <ResultsDisplay
              isLoading={isLoading}
              error={error}
              results={results}
              isCrawled={isCrawled}
              sourceName={sourceName}
            />
          </div>
        </main>
        
        <footer className="text-center mt-8 text-gray-500">
            <p>Powered by Gemini API</p>
            <a href="https://github.com/kevincobain2000/email_extractor" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-purple-400 transition-colors mt-2">
                <GithubIcon className="w-4 h-4"/>
                <span>Inspired by email_extractor</span>
            </a>
        </footer>
      </div>
    </div>
  );
};

export default App;