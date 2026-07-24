import { useState, useEffect } from 'react';

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = () => {
    const { innerWidth, innerHeight } = window;

    if (innerWidth < 480) {
      setBreakpoint('xs');
    } else if (innerWidth < 768) {
      setBreakpoint('sm');
    } else if (innerWidth < 992) {
      setBreakpoint('md');
    } else if (innerWidth < 1200) {
      setBreakpoint('lg');
    } else {
      setBreakpoint('xl');
    }

    setWindowSize({ width: innerWidth, height: innerHeight });
  };

  useEffect(() => {
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { breakpoint, ...windowSize };
};

export default useBreakpoint;
