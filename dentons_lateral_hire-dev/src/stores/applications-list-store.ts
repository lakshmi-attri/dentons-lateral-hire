import { create } from 'zustand';
import { storage } from '@/lib/storage';
import type { Application, ApplicationListItem, ApplicationStatus } from '@/types/application';

interface ApplicationsListState {
  applications: ApplicationListItem[];
  loading: boolean;

  loadUserApplications: (userId: string) => void;
  loadAllApplications: () => void;
  deleteApplication: (applicationId: string) => void;
  filterByStatus: (status: ApplicationStatus | 'all') => ApplicationListItem[];
}

export const useApplicationsListStore = create<ApplicationsListState>((set, get) => ({
  applications: [],
  loading: false,

  loadUserApplications: (userId) => {
    set({ loading: true });

    const allApplications = storage.get('applications') || [];
    const userApplications = allApplications
      .filter(app => app.userId === userId)
      .map(app => toListItem(app));

    set({ applications: userApplications, loading: false });
  },

  loadAllApplications: () => {
    set({ loading: true });

    const allApplications = storage.get('applications') || [];
    const listItems = allApplications.map(app => toListItem(app));

    set({ applications: listItems, loading: false });
  },

  deleteApplication: (applicationId) => {
    const applications = storage.get('applications') || [];
    const filtered = applications.filter(app => app.id !== applicationId);
    storage.set('applications', filtered);

    set(state => ({
      applications: state.applications.filter(app => app.id !== applicationId)
    }));
  },

  filterByStatus: (status) => {
    const { applications } = get();
    if (status === 'all') return applications;
    return applications.filter(app => app.status === status);
  },
}));

function toListItem(app: Application): ApplicationListItem {
  const completedSteps = app.data.completedSteps?.length || 0;
  const totalSteps = app.data.applicationType === 'individual' ? 10 : 14;
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  return {
    id: app.id,
    userId: app.userId,
    applicationType: app.data.applicationType || 'individual',
    candidateName: app.data.contactInfo?.legalFirstName && app.data.contactInfo?.legalLastName
      ? `${app.data.contactInfo.legalFirstName} ${app.data.contactInfo.legalLastName}`
      : 'Draft Application',
    email: app.data.contactInfo?.personalEmail || '',
    status: app.status,
    completionPercentage,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
  };
}
