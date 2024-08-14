// loading spinner component
import React from "react";

const LoadingSpinner = () => {
  return (
    // <div className="flex items-center justify-center h-[60vh]">
    //   <svg className="h-8 w-8 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    //     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    //     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    //   </svg>
    // </div>
    <div id="loader">
      <div class="ls-particles ls-part-1"></div>
      <div class="ls-particles ls-part-2"></div>
      <div class="ls-particles ls-part-3"></div>
      <div class="ls-particles ls-part-4"></div>
      <div class="ls-particles ls-part-5"></div>
      <div class="lightsaber ls-left ls-green"></div>
      <div class="lightsaber ls-right ls-red"></div>
      <div className="mt-14 flex space-x-1">
        {["L", "o", "a", "d", "i", "n", "g", "."].map((letter, index) => (
          <span key={index} className={`animate-sequentialLoading`} style={{ animationDelay: `${index * 0.1}s` }}>
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
