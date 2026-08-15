import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'proposal_sent',
  'won',
  'lost',
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface LeadInfo {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  source: string;
  status: LeadStatus;
  notes?: string | null;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
  assignedUser?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source?: string;
  status?: LeadStatus;
  notes?: string;
  assignedTo?: string;
}

export interface PaginatedLeadsResponse {
  data: LeadInfo[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useLeadsQuery(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const status = params?.status === 'all' ? '' : params?.status || '';
  const search = params?.search || '';

  return useQuery<PaginatedLeadsResponse>({
    queryKey: ['leads', page, limit, status, search],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (page) searchParams.set('page', String(page));
      if (limit) searchParams.set('limit', String(limit));
      if (status) searchParams.set('status', status);
      if (search) searchParams.set('search', search);

      const response = await api.get(`/leads?${searchParams.toString()}`);
      return response.data;
    },
  });
}

export function usePublicCreateLeadMutation() {
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      email: string;
      phone?: string;
      company?: string;
      source?: string;
      notes?: string;
    }) => {
      const response = await api.post('/leads/public', payload);
      return response.data;
    },
  });
}

export function useCreateLeadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateLeadPayload) => {
      const response = await api.post('/leads', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useUpdateLeadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
      source?: string;
      status?: LeadStatus;
      notes?: string;
      assignedTo?: string | null;
    }) => {
      const response = await api.patch(`/leads/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export interface LeadNoteItem {
  id: string;
  leadId: string;
  authorId?: string | null;
  content: string;
  type: 'note' | 'status_change' | 'assignment_change' | 'creation';
  createdAt: string;
  author?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
}

export function useLeadNotesQuery(leadId?: string | null) {
  return useQuery<LeadNoteItem[]>({
    queryKey: ['lead-notes', leadId],
    queryFn: async () => {
      if (!leadId) return [];
      const response = await api.get(`/leads/${leadId}/notes`);
      return response.data;
    },
    enabled: Boolean(leadId),
  });
}

export function useAddLeadNoteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ leadId, content }: { leadId: string; content: string }) => {
      const response = await api.post(`/leads/${leadId}/notes`, { content });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lead-notes', variables.leadId] });
    },
  });
}

export function useDeleteLeadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/leads/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
