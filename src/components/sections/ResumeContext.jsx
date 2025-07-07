import { createContext, useContext, useEffect } from 'react';
import useResumeStore from './useResumeStore';

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const clearOnRefresh = useResumeStore((state) => state.clearOnRefresh);
  const setFromPreview = useResumeStore((state) => state.setFromPreview);

  useEffect(() => {
    // Check if coming back from preview
    const urlParams = new URLSearchParams(window.location.search);
    const fromPreview = urlParams.get('fromPreview');
    
    if (fromPreview) {
      setFromPreview(true);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      clearOnRefresh();
    }

    // Set up beforeunload to detect refresh
    const handleBeforeUnload = () => {
      if (!window.location.search.includes('fromPreview')) {
        sessionStorage.removeItem('resume-storage');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [clearOnRefresh, setFromPreview]);

  return (
    <ResumeContext.Provider value={{}}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumeContext = () => useContext(ResumeContext);