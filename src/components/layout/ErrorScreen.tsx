export const ErrorScreen = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry?: () => void;
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-6">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);
