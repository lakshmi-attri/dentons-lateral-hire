import type { ApplicationStatus, ApplicationStatusHistory } from '@/types/application';

const STATUS_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  draft: ['submitted', 'withdrawn'],
  submitted: ['under_review', 'withdrawn'],
  under_review: ['additional_info_required', 'approved', 'rejected'],
  additional_info_required: ['submitted', 'withdrawn'],
  approved: [],
  rejected: [],
  withdrawn: [],
};

export class ApplicationStateMachine {
  canTransitionTo(
    currentStatus: ApplicationStatus,
    newStatus: ApplicationStatus
  ): boolean {
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus];
    return allowedTransitions.includes(newStatus);
  }

  createStatusHistory(
    from: ApplicationStatus | null,
    to: ApplicationStatus,
    userId: string,
    comment?: string
  ): ApplicationStatusHistory {
    return {
      from,
      to,
      timestamp: Date.now(),
      changedBy: userId,
      comment,
    };
  }

  getAvailableTransitions(currentStatus: ApplicationStatus): ApplicationStatus[] {
    return STATUS_TRANSITIONS[currentStatus];
  }
}

export const statusMachine = new ApplicationStateMachine();
