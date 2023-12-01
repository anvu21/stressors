import React, { useState, useEffect } from 'react';

const LoadingBar = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
      {loading ? (
        <div className="h-full bg-blue-500 animate-loading-bar" />
      ) : (
        <div className="h-full bg-green-500" />
      )}
    </div>
  );
};

const LoadingText = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ? (
        <p className="text-center text-gray-500 text-base">Loading...</p>
      ) : (
        <p className="text-center text-green-500 text-base">Loaded!</p>
      )}
    </div>
  );
};

const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center m-10">
      <LoadingBar />
      <LoadingText />
    </div>
  );
};

export default LoadingAnimation;
