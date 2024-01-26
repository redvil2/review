import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom React hook for scrolling to the top of the page when the pathname changes.
 *
 * @description This hook listens for changes in the pathname, using the `useLocation` hook from
 * React Router. It triggers a scroll to the top of the page whenever the pathname changes,
 * ensuring that the user is always presented with the top of the new page content on navigation.
 *
 * @function useScrollToTop
 * @returns {void}
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};
