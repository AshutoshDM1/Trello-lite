import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseHotkeysOptions {
  userRole?: string;
  onSearchFocus?: () => void;
  onAddLead?: () => void;
  onCloseModal?: () => void;
  onNextRow?: () => void;
  onPrevRow?: () => void;
  onSelectRow?: () => void;
  onExportCSV?: () => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  onDeleteSelected?: () => void;
}

export function useHotkeys({
  userRole,
  onSearchFocus,
  onAddLead,
  onCloseModal,
  onNextRow,
  onPrevRow,
  onSelectRow,
  onExportCSV,
  onNextPage,
  onPrevPage,
  onDeleteSelected,
}: UseHotkeysOptions = {}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing inside text inputs, textareas, or select dropdowns
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputActive =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        activeTag === 'select' ||
        document.activeElement?.getAttribute('contenteditable') === 'true';

      // Global Esc key for closing modals or drawers
      if (e.key === 'Escape') {
        if (onCloseModal) {
          onCloseModal();
        }
        return;
      }

      // Export CSV shortcut: Alt + E
      if (e.altKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        if (onExportCSV) onExportCSV();
        return;
      }

      // Add Lead shortcut: Alt + N
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        if (onAddLead) onAddLead();
        return;
      }

      // Quick Tab Navigation: Alt + 1..4
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === '1') {
          e.preventDefault();
          navigate('/dashboard');
          return;
        }
        if (e.key === '2') {
          e.preventDefault();
          navigate('/dashboard/leads');
          return;
        }
        if (e.key === '3') {
          e.preventDefault();
          navigate('/dashboard/profile');
          return;
        }
        if (e.key === '4') {
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

      // Table-specific shortcuts when NOT typing inside inputs or select elements
      if (!isInputActive) {
        if (e.key === '/') {
          e.preventDefault();
          if (onSearchFocus) onSearchFocus();
          return;
        }

        // Row Navigation (J / ArrowDown, K / ArrowUp)
        if (e.key.toLowerCase() === 'j' || e.key === 'ArrowDown') {
          e.preventDefault();
          if (onNextRow) onNextRow();
          return;
        }
        if (e.key.toLowerCase() === 'k' || e.key === 'ArrowUp') {
          e.preventDefault();
          if (onPrevRow) onPrevRow();
          return;
        }

        // Row Selection / Open Notes (Enter, Space, or O)
        if (e.key === 'Enter' || e.key === ' ' || e.key.toLowerCase() === 'o') {
          e.preventDefault();
          if (onSelectRow) onSelectRow();
          return;
        }

        // Delete Row (Delete or Backspace)
        if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          if (onDeleteSelected) onDeleteSelected();
          return;
        }

        // Page Navigation ([ or LeftArrow, ] or RightArrow)
        if (e.key === '[' || e.key === 'ArrowLeft') {
          e.preventDefault();
          if (onPrevPage) onPrevPage();
          return;
        }
        if (e.key === ']' || e.key === 'ArrowRight') {
          e.preventDefault();
          if (onNextPage) onNextPage();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    navigate,
    onSearchFocus,
    onAddLead,
    onCloseModal,
    onNextRow,
    onPrevRow,
    onSelectRow,
    onExportCSV,
    onNextPage,
    onPrevPage,
    onDeleteSelected,
  ]);
}
