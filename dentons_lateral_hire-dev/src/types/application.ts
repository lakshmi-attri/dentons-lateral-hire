import type { LCQStore } from '@/stores/lcq-store';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'additional_info_required'
  | 'approved'
  | 'rejected'
  | 'withdrawn';

export interface ApplicationStatusHistory {
  from: ApplicationStatus | null;
  to: ApplicationStatus;
  timestamp: number;
  changedBy: string;
  comment?: string;
}

export interface Application {
  id: string;
  userId: string;
  status: ApplicationStatus;
  statusHistory: ApplicationStatusHistory[];
  data: Partial<LCQStore>;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationListItem {
  id: string;
  userId: string;
  applicationType: 'individual' | 'group';
  candidateName: string;
  email: string;
  status: ApplicationStatus;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}
