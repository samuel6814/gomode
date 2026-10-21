import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls to the top-left corner of the page instantly
    window.scrollTo(0, 0);
  }, [pathname]); // Triggers every time the URL path changes

  return null;
};

export default ScrollToTop;