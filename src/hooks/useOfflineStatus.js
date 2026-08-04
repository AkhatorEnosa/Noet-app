import { useEffect, useState } from 'react';
import { isOnline } from '../utils/offlineCache';

/**
 * Hook that tracks the browser's online/offline status.
 * Re-renders the component when connectivity changes.
 * @returns {boolean} `true` if online, `false` if offline
 */
const useOfflineStatus = () => {
  const [online, setOnline] = useState(isOnline());

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
};

export default useOfflineStatus;