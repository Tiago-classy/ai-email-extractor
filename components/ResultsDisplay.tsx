import React from 'react';
import { MailIcon, PaperPlaneIcon } from './icons';
import type { Result } from '../App';

interface ResultsDisplayProps {
  isLoading: boolean;
  error: string | null;
  results: Result;
  isCrawled: boolean;
  sourceName: string;
}

const WelcomeMessage: React.FC = () => (
  <div className="text-center text-gray-400 py-8">
    <h3 className="text-lg font-medium text-gray-300">Ready to Start?</h3>
    <p>Enter a URL or upload a CSV file to begin extracting emails.</p>
  </div>
);

const LoadingSpinner: React.FC<{sourceName: string}> = ({ sourceName }) => (
  <div className="flex flex-col items-center justify-center text-center text-gray-400 py-8">
      <svg className="animate-spin h-8 w-8 text-purple-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <h3 className="text-lg font-medium text-gray-300">AI is at work...</h3>
      <p>Simulating crawl and analyzing {sourceName ? <span className="font-medium text-purple-300">{sourceName}</span> : 'your request'}.</p>
  </div>
);


const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
    <strong className="font-bold">Error: </strong>
    <span className="block sm:inline">{message}</span>
  </div>
);

interface ResultsListProps {
    results: Result;
}

const ResultsList: React.FC<ResultsListProps> = ({ results }) => {
    const totalEmails = Object.values(results).reduce((acc, result) => {
        if (result.status === 'success') {
            return acc + result.emails.length;
        }
        return acc;
    }, 0);

    const generateOutreachMailto = (recipient: string, sourceUrl: string) => {
        const subject = "Advertising Proposal";
        const body = `Dear Sir/Madam,

it was with great joy that I've found your contact on your website (${sourceUrl}).

I'd like to reach out to you on a meeting as I'd like to explain my interest in driving an advertising campaign in your website and pay you for that based on the traffic your website has.

Looking forward to hearing from you.

Best regards,
Your Best AI Media Buyer`;
        return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-gray-200">Found {totalEmails} email(s) across {Object.keys(results).length} source(s)</h3>
            </div>
            <ul className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
                {Object.entries(results).map(([url, result]) => (
                <li key={url} className="px-4 py-3 hover:bg-gray-800/50 transition-colors">
                    <p className="font-medium text-purple-300 break-all">{url}</p>
                    {result.status === 'success' ? (
                        result.emails.length > 0 ? (
                            <ul className="mt-2 space-y-1 pl-2">
                                {result.emails.map(email => (
                                    <li key={email} className="flex items-center justify-between gap-2 text-sm text-gray-300 py-1">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <MailIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                            <span className="truncate">{email}</span>
                                        </div>
                                        <a
                                            href={generateOutreachMailto(email, url)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-purple-600 text-white font-semibold rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-colors flex-shrink-0"
                                            aria-label={`Send email to ${email}`}
                                        >
                                            <PaperPlaneIcon className="w-3 h-3"/>
                                            <span>Contact</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 mt-1">No emails found.</p>
                        )
                    ) : (
                        <p className="text-sm text-red-400 mt-1">Error: {result.message}</p>
                    )}
                </li>
                ))}
            </ul>
        </div>
    );
}

const NoResults: React.FC<{isCrawled: boolean}> = ({ isCrawled }) => (
    <div className="text-center text-gray-400 py-8">
        <h3 className="text-lg font-medium text-gray-300">No Emails Found</h3>
        {isCrawled && <p>The AI couldn't find any email addresses from the provided source(s).</p>}
    </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ isLoading, error, results, isCrawled, sourceName }) => {
  if (isLoading) {
    return <LoadingSpinner sourceName={sourceName} />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }
  
  if (!isCrawled) {
    return <WelcomeMessage />;
  }
  
  const hasResults = Object.values(results).some(r => r.status === 'success' && r.emails.length > 0);

  if (hasResults) {
    return <ResultsList 
        results={results}
    />;
  }
  
  return <NoResults isCrawled={isCrawled} />;
};