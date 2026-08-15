import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Loader2,
  Plus,
  ExternalLink,
  Trash2,
  Phone,
  Building2,
  Tag,
  ChevronLeft,
  ChevronRight,
  Globe,
  Share2,
  MessageSquare,
  Mail,
  Sliders,
  Sparkles,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useLeadsQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  LEAD_STATUSES,
  type LeadInfo,
  type LeadStatus,
} from '@/hooks/useLeads';
import { useUsersQuery, type UserInfo } from '@/hooks/useUsers';
import { useHotkeys } from '@/hooks/useHotkeys';
import { Link } from 'react-router-dom';
import { LeadNotesDrawer } from './LeadNotesDrawer';

interface LeadsDirectoryProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  getInitials: (name?: string | null) => string;
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; badgeClass: string; dotClass: string }> = {
  new: {
    label: 'New',
    badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dotClass: 'bg-blue-400',
  },
  contacted: {
    label: 'Contacted',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dotClass: 'bg-amber-400',
  },
  qualified: {
    label: 'Qualified',
    badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    dotClass: 'bg-purple-400',
  },
  proposal_sent: {
    label: 'Proposal Sent',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    dotClass: 'bg-indigo-400',
  },
  won: {
    label: 'Won',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
  },
  lost: {
    label: 'Lost',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dotClass: 'bg-rose-400',
  },
};

const SOURCE_CONFIG: Record<string, { label: string; badgeClass: string; icon: any }> = {
  website: {
    label: 'Website Form',
    badgeClass: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    icon: Globe,
  },
  referral: {
    label: 'Referral',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: Share2,
  },
  linkedin: {
    label: 'LinkedIn',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    icon: MessageSquare,
  },
  social_media: {
    label: 'Social Media',
    badgeClass: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    icon: Sparkles,
  },
  cold_outreach: {
    label: 'Cold Outreach',
    badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    icon: Mail,
  },
  dashboard: {
    label: 'Dashboard',
    badgeClass: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    icon: Sliders,
  },
};

export function LeadsDirectory({ searchQuery, setSearchQuery, getInitials }: LeadsDirectoryProps) {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLeadForNotes, setSelectedLeadForNotes] = useState<LeadInfo | null>(null);

  // Pagination & Page Size State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Debounced search query state to prevent spamming backend requests
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 600);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'dashboard',
    status: 'new' as LeadStatus,
    notes: '',
    assignedTo: '',
  });

  const {
    data: leadsResponse,
    isLoading: isLeadsLoading,
    isError: isLeadsError,
  } = useLeadsQuery({
    page: currentPage,
    limit: pageSize,
    status: selectedStatusFilter,
    search: debouncedSearchQuery,
  });
  const { data: usersList } = useUsersQuery();

  const createMutation = useCreateLeadMutation();
  const updateMutation = useUpdateLeadMutation();
  const deleteMutation = useDeleteLeadMutation();

  const leadsList = leadsResponse?.data || [];
  const pagination = leadsResponse?.pagination;

  const totalItems = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = totalItems > 0 ? (safeCurrentPage - 1) * pageSize : 0;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  // Reset selectedIndex when leads list updates
  useEffect(() => {
    setSelectedIndex(0);
  }, [currentPage, selectedStatusFilter, debouncedSearchQuery]);

  const handleDelete = (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      deleteMutation.mutate(leadId);
    }
  };

  const handleExportCSV = () => {
    if (!leadsList || leadsList.length === 0) {
      alert('No leads available to export.');
      return;
    }

    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Company',
      'Source',
      'Status',
      'Assigned To',
      'Notes',
      'Created At',
    ];
    const rows = leadsList.map((l) => [
      `"${l.id || ''}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.source || '').replace(/"/g, '""')}"`,
      `"${(l.status || '').replace(/"/g, '""')}"`,
      `"${(l.assignedUser?.name || l.assignedUser?.email || 'Unassigned').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${l.createdAt ? new Date(l.createdAt).toLocaleString() : ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useHotkeys({
    onSearchFocus: () => searchInputRef.current?.focus(),
    onAddLead: () => setIsAddModalOpen(true),
    onCloseModal: () => {
      setIsAddModalOpen(false);
      setSelectedLeadForNotes(null);
    },
    onNextRow: () => {
      if (leadsList.length > 0) {
        setSelectedIndex((prev) => Math.min(prev + 1, leadsList.length - 1));
      }
    },
    onPrevRow: () => {
      if (leadsList.length > 0) {
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }
    },
    onSelectRow: () => {
      if (leadsList[selectedIndex]) {
        setSelectedLeadForNotes(leadsList[selectedIndex]);
      }
    },
    onExportCSV: () => handleExportCSV(),
    onNextPage: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
    onPrevPage: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
    onDeleteSelected: () => {
      if (leadsList[selectedIndex]) {
        handleDelete(leadsList[selectedIndex].id);
      }
    },
  });

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    updateMutation.mutate({ id: leadId, status: newStatus });
  };

  const handleAssigneeChange = (leadId: string, userId: string) => {
    const assignedTo = userId === 'unassigned' ? null : userId;
    updateMutation.mutate({ id: leadId, assignedTo });
  };

  // Duplicate detection checks in Add Modal
  const isDuplicateEmail = Boolean(
    newLeadForm.email.trim() &&
    leadsList.some((l) => l.email.toLowerCase() === newLeadForm.email.trim().toLowerCase()),
  );
  const isDuplicatePhone = Boolean(
    newLeadForm.phone.trim() &&
    leadsList.some((l) => l.phone && l.phone.trim() === newLeadForm.phone.trim()),
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name.trim() || !newLeadForm.email.trim()) return;

    createMutation.mutate(
      {
        ...newLeadForm,
        assignedTo: newLeadForm.assignedTo || undefined,
      },
      {
        onSuccess: () => {
          setIsAddModalOpen(false);
          setNewLeadForm({
            name: '',
            email: '',
            phone: '',
            company: '',
            source: 'dashboard',
            status: 'new',
            notes: '',
            assignedTo: '',
          });
        },
      },
    );
  };

  // Helper for source badge configuration
  const getSourceBadge = (sourceStr: string) => {
    const key = sourceStr.toLowerCase();
    const config = SOURCE_CONFIG[key] || {
      label: sourceStr,
      badgeClass: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
      icon: Tag,
    };
    const IconComp = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${config.badgeClass}`}
      >
        <IconComp className="size-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Leads Pipeline
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted border border-border text-foreground font-mono">
              {leadsList?.length || 0} Total
            </span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage prospective customer leads, pipeline stages, and assignments.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2 border-border cursor-pointer"
          >
            <Download className="size-3.5" /> Export CSV
          </Button>
          <Link to="/capture" target="_blank">
            <Button variant="outline" size="sm" className="gap-2 border-border cursor-pointer">
              <ExternalLink className="size-3.5" /> Public Capture Form
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2 font-medium cursor-pointer"
          >
            <Plus className="size-4" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-3 rounded-xl border border-border">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search lead, email, company... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 h-9 border-input bg-background"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              setSelectedStatusFilter('all');
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedStatusFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            All Leads
          </button>
          {LEAD_STATUSES.map((statusKey) => (
            <button
              key={statusKey}
              onClick={() => {
                setSelectedStatusFilter(statusKey);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer capitalize whitespace-nowrap ${
                selectedStatusFilter === statusKey
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {STATUS_CONFIG[statusKey].label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table Container */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col justify-between">
        {isLeadsLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground font-mono">Loading leads pipeline...</p>
          </div>
        ) : isLeadsError ? (
          <div className="p-8 text-center text-xs text-destructive">
            Failed to load leads list. Please check backend connection.
          </div>
        ) : leadsList.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground space-y-3">
            <p>No leads found matching your search criteria.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatusFilter('all');
                setCurrentPage(1);
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                <tr>
                  <th className="px-5 py-3">Lead Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Assigned To</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leadsList.map((leadItem: LeadInfo, index: number) => {
                  const isUpdatingThisLead =
                    updateMutation.isPending && updateMutation.variables?.id === leadItem.id;
                  const isDeletingThisLead =
                    deleteMutation.isPending && deleteMutation.variables === leadItem.id;

                  const statusCfg = STATUS_CONFIG[leadItem.status] || STATUS_CONFIG.new;
                  const isSelectedRow = index === selectedIndex;

                  return (
                    <tr
                      key={leadItem.id}
                      onClick={() => setSelectedIndex(index)}
                      className={`transition-colors cursor-pointer ${
                        isSelectedRow
                          ? 'bg-primary/10 border-l-4 border-l-primary'
                          : 'hover:bg-muted/40'
                      }`}
                    >
                      {/* Lead Name */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedLeadForNotes(leadItem)}
                            className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20 shrink-0 hover:bg-primary/20 cursor-pointer transition-colors"
                            title="View Notes & Activity History"
                          >
                            {getInitials(leadItem.name)}
                          </button>
                          <button
                            onClick={() => setSelectedLeadForNotes(leadItem)}
                            className="font-semibold text-foreground hover:text-primary hover:underline text-left cursor-pointer transition-colors"
                          >
                            {leadItem.name}
                          </button>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs font-mono text-muted-foreground">
                        {leadItem.email}
                      </td>

                      {/* Company */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs">
                        {leadItem.company ? (
                          <div className="flex items-center gap-1.5 text-foreground font-medium">
                            <Building2 className="size-3 text-muted-foreground" />
                            {leadItem.company}
                          </div>
                        ) : (
                          <span className="text-muted-foreground font-mono text-[11px]">N/A</span>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs font-mono text-muted-foreground">
                        {leadItem.phone ? (
                          <div className="flex items-center gap-1.5">
                            <Phone className="size-3 text-muted-foreground" />
                            {leadItem.phone}
                          </div>
                        ) : (
                          <span className="text-muted-foreground font-mono text-[11px]">N/A</span>
                        )}
                      </td>

                      {/* Color-Coded Status Dropdown */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Select
                            value={leadItem.status}
                            onValueChange={(val: LeadStatus) =>
                              handleStatusChange(leadItem.id, val)
                            }
                            disabled={isUpdatingThisLead}
                          >
                            <SelectTrigger
                              className={`h-8 w-34 text-xs font-semibold border ${statusCfg.badgeClass}`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className={`size-2 rounded-full ${statusCfg.dotClass}`} />
                                <SelectValue>{statusCfg.label}</SelectValue>
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {LEAD_STATUSES.map((st) => (
                                <SelectItem key={st} value={st} className="text-xs capitalize">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`size-2 rounded-full ${STATUS_CONFIG[st].dotClass}`}
                                    />
                                    {STATUS_CONFIG[st].label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {isUpdatingThisLead && (
                            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </td>

                      {/* Color-Differentiated Source Badge */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {getSourceBadge(leadItem.source)}
                      </td>

                      {/* Assigned User Select */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Select
                          value={leadItem.assignedTo || 'unassigned'}
                          onValueChange={(val) => handleAssigneeChange(leadItem.id, val)}
                          disabled={isUpdatingThisLead}
                        >
                          <SelectTrigger className="h-8 w-36 text-xs border-border bg-background">
                            <SelectValue>{leadItem.assignedUser?.name || 'Unassigned'}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              value="unassigned"
                              className="text-xs text-muted-foreground"
                            >
                              Unassigned
                            </SelectItem>
                            {(usersList || []).map((u: UserInfo) => (
                              <SelectItem key={u.id} value={u.id} className="text-xs">
                                {u.name || u.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedLeadForNotes(leadItem)}
                            title="View Notes & Activity History"
                            className="size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <MessageSquare className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(leadItem.id)}
                            disabled={isDeletingThisLead}
                            title="Delete Lead"
                            className="size-8 text-muted-foreground hover:text-destructive cursor-pointer"
                          >
                            {isDeletingThisLead ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination & Page Size Control Bar */}
        {!isLeadsLoading && !isLeadsError && totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border bg-muted/30 text-xs">
            {/* Left: Items counter */}
            <div className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-foreground">{endIndex}</span> of{' '}
              <span className="font-semibold text-foreground">{totalItems}</span> leads
            </div>

            {/* Right: Page size option & pagination buttons */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Rows per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Rows per page:</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(val) => {
                    setPageSize(Number(val));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-7 w-16 text-xs border-border bg-background">
                    <SelectValue>{pageSize}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5" className="text-xs">
                      5
                    </SelectItem>
                    <SelectItem value="10" className="text-xs">
                      10
                    </SelectItem>
                    <SelectItem value="20" className="text-xs">
                      20
                    </SelectItem>
                    <SelectItem value="50" className="text-xs">
                      50
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Page Controls */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={safeCurrentPage === 1}
                  className="size-7 border-border cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="size-3.5" />
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`size-7 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                        safeCurrentPage === pageNum
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={safeCurrentPage === totalPages}
                  className="size-7 border-border cursor-pointer disabled:opacity-40"
                >
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Modal Dialog */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground">Add New Lead</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {(isDuplicateEmail || isDuplicatePhone) && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span>
                    Potential Duplicate: A lead with this{' '}
                    {isDuplicateEmail && isDuplicatePhone
                      ? 'email and phone'
                      : isDuplicateEmail
                        ? 'email'
                        : 'phone'}{' '}
                    already exists in your pipeline.
                  </span>
                </div>
              )}

              {createMutation.isError && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                  {(createMutation.error as any)?.response?.data?.message ||
                    'Failed to create lead. Please check the details and try again.'}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    type="text"
                    placeholder="Acme Client"
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    className="h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="client@acme.com"
                    value={newLeadForm.email}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">Phone</label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">Company</label>
                  <Input
                    type="text"
                    placeholder="Acme Corp"
                    value={newLeadForm.company}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">Initial Status</label>
                  <select
                    value={newLeadForm.status}
                    onChange={(e) =>
                      setNewLeadForm({ ...newLeadForm, status: e.target.value as LeadStatus })
                    }
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs capitalize"
                  >
                    {LEAD_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {STATUS_CONFIG[st].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">Assign To</label>
                  <select
                    value={newLeadForm.assignedTo}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, assignedTo: e.target.value })}
                    className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs"
                  >
                    <option value="">Unassigned</option>
                    {(usersList || []).map((u: UserInfo) => (
                      <option key={u.id} value={u.id}>
                        {u.name || u.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Initial requirements or comments..."
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-md border border-input bg-background text-xs text-foreground resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Saving...' : 'Create Lead'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Notes & Activity Log Drawer */}
      {selectedLeadForNotes && (
        <LeadNotesDrawer
          lead={selectedLeadForNotes}
          onClose={() => setSelectedLeadForNotes(null)}
          getInitials={getInitials}
        />
      )}
    </div>
  );
}
