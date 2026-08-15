import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseHotkeysOptions {
  userRole?: string;
  onSearchFocus?: () => void;
  onCloseModal?: () => void;
}

export function useHotkeys({ userRole, onSearchFocus, onCloseModal }: UseHotkeysOptions = {}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global Esc key for closing modals
      if (e.key === 'Escape') {
        if (onCloseModal) {
          onCloseModal();
        }
        return;
      }

      // Quick Tab Navigation: Alt + 1..3
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === '1') {
          e.preventDefault();
          navigate('/dashboard');
          return;
        }
        if (e.key === '2') {
          e.preventDefault();
          navigate('/dashboard/profile');
          return;
        }
        if (e.key === '3') {
          e.preventDefault();
          if (userRole === 'admin') {
            navigate('/dashboard/users');
          }
          return;
        }
      }

      // Search shortcut: Ctrl + K or Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (onSearchFocus) {
          onSearchFocus();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onSearchFocus, onCloseModal, userRole]);
}
