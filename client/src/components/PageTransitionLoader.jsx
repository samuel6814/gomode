import React, { useState, useEffect } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import GlobalLoader from './GlobalLoader';

const PageTransitionLoader = ({ children }) => {
  // Check if any queries are currently fetching their initial data
  const pendingQueriesCount = useIsFetching({ 
    predicate: query => query.state.status === 'pending' 
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // If there are no pending queries, wait a tiny bit to ensure no new queries are immediately fired by children
    if (pendingQueriesCount === 0) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 300); // 300ms buffer
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
    }
  }, [pendingQueriesCount]);

  return (
    <>
      {!isReady && <GlobalLoader />}
      <div style={{ 
        opacity: isReady ? 1 : 0, 
        visibility: isReady ? 'visible' : 'hidden',
        transition: 'opacity 0.4s ease-in',
        minHeight: isReady ? 'auto' : '100vh',
        overflow: isReady ? 'visible' : 'hidden'
      }}>
        {children}
      </div>
    </>
  );
};

export default PageTransitionLoader;
