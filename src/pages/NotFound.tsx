
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

/**
 NotFound Component
  
 Displayed when a user navigates to a non-existent route.
 Logs the attempted path for debugging purposes.
 */
const NotFound = () => {
  // Get current location to log the invalid path
  const location = useLocation();

  // Log the 404 error for debugging
  // This will log the error to the console
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
