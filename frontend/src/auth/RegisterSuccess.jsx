import React, { useEffect, useState } from 'react';

const RegistrationSuccess = () => {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    // Set the countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer); // Stop the countdown when it reaches 1
          useEffect(() => {
            // Set the countdown
            const timer = setInterval(() => {
              setCountdown((prev) => {
                if (prev === 1) {
                  clearInterval(timer); // Stop the countdown when it reaches 1
                  window.location.href ='/login'; // Redirect to the login page
                }
                return prev - 1; // Decrease the countdown by 1 every second
              });
            }, 1000); // Update every second
        
            // Clean up the interval when the component is unmounted
            return () => clearInterval(timer);
          }, [navigate]);        }
        return prev - 1; // Decrease the countdown every second
      });
    }, 1000); // Update every second

    // Cleanup the timer when the component is unmounted
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-6">Your account has been created successfully!</h2>
        <p className="text-gray-700 mb-4">Redirecting to the login page in {countdown}...</p>
        <p className="text-sm text-gray-500">If the redirection doesn't happen automatically, <a href="/login" className="text-indigo-600 hover:text-indigo-700">click here</a>.</p>
      </div>    
    </div>
  );
};

export default RegistrationSuccess;
