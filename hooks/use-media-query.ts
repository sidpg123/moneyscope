import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    const handleChange = () => {
      setMatches(mediaQueryList.matches);
    };

    // Initial check
    handleChange();

    // Listen for changes
    mediaQueryList.addEventListener('change', handleChange);

    // Cleanup on unmount
    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}
