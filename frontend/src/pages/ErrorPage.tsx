import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage = 'An unexpected error occurred.';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-sans text-white/90">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <h1 className="text-6xl font-light tracking-[-0.04em] mb-2 text-white/90">
          {errorStatus}
        </h1>
        <h2 className="text-xl font-normal mb-8 text-white/70">
          {errorStatus === 404 ? 'Page Not Found' : 'Oops! Something went wrong'}
        </h2>
        
        <div className="bg-white/5 rounded-2xl p-4 mb-10 border border-white/10">
          <p className="text-white/55 text-sm break-words">
            {errorMessage}
          </p>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-white text-black hover:bg-white/90 transition-colors duration-200"
        >
          <svg 
            className="w-5 h-5 mr-2 -ml-1 stroke-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to Map
        </Link>
      </div>
    </div>
  );
}
