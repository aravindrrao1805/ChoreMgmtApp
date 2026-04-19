import { useEffect } from 'react';

export function useServerEvents(onRefresh) {
  useEffect(() => {
    const es = new EventSource('/api/events');
    es.addEventListener('refresh', onRefresh);
    return () => es.close();
  }, [onRefresh]);
}
