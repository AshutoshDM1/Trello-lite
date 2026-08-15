import { useState } from 'react';
import {
  X,
  Send,
  Loader2,
  MessageSquare,
  Activity,
  UserPlus,
  Sparkles,
  Building2,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useLeadNotesQuery,
  useAddLeadNoteMutation,
  type LeadInfo,
  type LeadNoteItem,
} from '@/hooks/useLeads';

interface LeadNotesDrawerProps {
  lead: LeadInfo | null;
  onClose: () => void;
  getInitials: (name?: string | null) => string;
}

export function LeadNotesDrawer({ lead, onClose, getInitials }: LeadNotesDrawerProps) {
  const [newNoteContent, setNewNoteContent] = useState('');

  const { data: notesList, isLoading: isNotesLoading } = useLeadNotesQuery(lead?.id);
  const addNoteMutation = useAddLeadNoteMutation();

  if (!lead) return null;

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    addNoteMutation.mutate(
      {
        leadId: lead.id,
        content: newNoteContent.trim(),
      },
      {
        onSuccess: () => {
          setNewNoteContent('');
        },
      },
    );
  };

  const getTimelineIcon = (type: LeadNoteItem['type']) => {
    switch (type) {
      case 'status_change':
        return <Activity className="size-3.5 text-blue-400" />;
      case 'assignment_change':
        return <UserPlus className="size-3.5 text-purple-400" />;
      case 'creation':
        return <Sparkles className="size-3.5 text-emerald-400" />;
      case 'note':
      default:
        return <MessageSquare className="size-3.5 text-amber-400" />;
    }
  };

  const getTimelineBadgeClass = (type: LeadNoteItem['type']) => {
    switch (type) {
      case 'status_change':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'assignment_change':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      case 'creation':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'note':
      default:
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 cursor-default"
      >
        {/* Drawer Top Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center space-x-3">
            <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20 shrink-0">
              {getInitials(lead.name)}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base text-foreground truncate">{lead.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <Mail className="size-3" />
                <span className="truncate">{lead.email}</span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Quick Details Bar */}
        <div className="px-5 py-3 border-b border-border bg-muted/10 grid grid-cols-2 gap-2 text-xs">
          {lead.company && (
            <div className="flex items-center gap-1.5 text-foreground truncate">
              <Building2 className="size-3 text-muted-foreground shrink-0" />
              <span className="truncate font-medium">{lead.company}</span>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center gap-1.5 text-muted-foreground font-mono truncate">
              <Phone className="size-3 shrink-0" />
              <span className="truncate">{lead.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="text-[11px] uppercase font-mono text-muted-foreground">Status:</span>
            <span className="capitalize font-semibold text-foreground">
              {lead.status.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="text-[11px] uppercase font-mono text-muted-foreground">Source:</span>
            <span className="capitalize font-semibold text-foreground">{lead.source}</span>
          </div>
        </div>

        {/* Activity Timeline List */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Clock className="size-3.5" />
            Activity History & Notes
          </h4>

          {isNotesLoading ? (
            <div className="p-8 flex flex-col items-center justify-center space-y-2 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              <p className="text-xs font-mono">Loading activity history...</p>
            </div>
          ) : !notesList || notesList.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground space-y-1">
              <p className="font-medium">No activity or notes logged yet.</p>
              <p className="text-[11px]">Type a note below to start documenting this lead.</p>
            </div>
          ) : (
            <div className="relative space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
              {notesList.map((item: LeadNoteItem) => (
                <div key={item.id} className="relative flex items-start space-x-3 text-xs">
                  {/* Timeline Badge Dot */}
                  <div
                    className={`relative z-10 size-7 rounded-full flex items-center justify-center border shrink-0 bg-card ${getTimelineBadgeClass(
                      item.type,
                    )}`}
                  >
                    {getTimelineIcon(item.type)}
                  </div>

                  {/* Content Box */}
                  <div className="flex-1 bg-muted/30 border border-border p-3 rounded-xl space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-semibold text-foreground">
                        {item.author?.name ||
                          (item.type === 'creation' ? 'System / Lead Form' : 'Team Member')}
                      </span>
                      <span className="text-muted-foreground font-mono text-[10px]">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Note Bottom Input */}
        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSubmitNote} className="space-y-2">
            <textarea
              rows={2}
              placeholder="Add a call note, meeting update, or reminder..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="w-full p-3 rounded-xl border border-input bg-background text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground font-mono">
                Press Enter to post note
              </span>
              <Button
                type="submit"
                size="sm"
                disabled={!newNoteContent.trim() || addNoteMutation.isPending}
                className="gap-1.5 cursor-pointer text-xs"
              >
                {addNoteMutation.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Send className="size-3.5" />
                )}
                Add Note
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
