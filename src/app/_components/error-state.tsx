interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ title, message, onRetry }: ErrorStateProps) => (
  <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-6 flex items-start mb-8 shadow-sm">
    <div className="bg-red-100 p-2 rounded-full mr-4">
      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-red-900">{title}</h3>
      <p className="text-red-700 mt-1">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 px-4 py-2 bg-white border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-50 transition-colors shadow-sm">
          Try Again
        </button>
      )}
    </div>
  </div>
);
