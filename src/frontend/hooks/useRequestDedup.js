import { useRef } from 'react';

export const useRequestDedup = () => {
  const pendingRequests = useRef(new Map());

  const dedupedRequest = async (key, requestFn) => {
    if (pendingRequests.current.has(key)) {
      return pendingRequests.current.get(key);
    }

    const promise = requestFn().finally(() => {
      pendingRequests.current.delete(key);
    });

    pendingRequests.current.set(key, promise);
    return promise;
  };

  return dedupedRequest;
};
