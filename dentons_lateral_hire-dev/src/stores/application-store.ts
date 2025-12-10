import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface HistoricalBilling {
  id: string;
  client: string;
  matter: string;
  year1: number;
  year2: number;
  year3: number;
}

export interface PortableClient {
  id: string;
  clientName: string;
  estimatedBilling: number;
  likelihood: "High" | "Medium" | "Low";
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  yearsWithPartner: number;
  expectedToJoin: "Yes" | "No" | "Undecided";
}

export interface BioData {
  fullName: string;
  preferredName: string;
  currentFirm: string;
  currentTitle: string;
  barYear: string;
  barState: string;
  practiceYears: string;
  practiceAreas: string;
  biography: string;
}

export interface TeamOverview {
  totalTeamSize: string;
  associates: string;
  staff: string;
}

export interface StrategyData {
  whyDentons: string;
  growthStrategy: string;
  practiceAreas: string[];
  regions: string[];
  referralSource: string;
  additionalComments: string;
}

export const STEP_ORDER = [
  "/application/bio",
  "/application/financials",
  "/application/team",
  "/application/strategy",
] as const;

export type StepPath = (typeof STEP_ORDER)[number];

interface ApplicationState {
  bio: BioData;
  billings: HistoricalBilling[];
  portableClients: PortableClient[];
  teamOverview: TeamOverview;
  teamMembers: TeamMember[];
  strategy: StrategyData;
  completedSteps: StepPath[];

  updateBio: (data: Partial<BioData>) => void;
  setBio: (data: BioData) => void;
  markStepCompleted: (step: StepPath) => void;
  isStepCompleted: (step: StepPath) => boolean;
  isStepAccessible: (step: StepPath) => boolean;
  getNextIncompleteStep: () => StepPath;
  addBilling: (billing: Omit<HistoricalBilling, "id">) => void;
  updateBilling: (id: string, billing: Partial<HistoricalBilling>) => void;
  deleteBilling: (id: string) => void;
  deleteBillings: (ids: string[]) => void;
  addPortableClient: (client: Omit<PortableClient, "id">) => void;
  updatePortableClient: (id: string, client: Partial<PortableClient>) => void;
  deletePortableClient: (id: string) => void;
  deletePortableClients: (ids: string[]) => void;
  updateTeamOverview: (data: Partial<TeamOverview>) => void;
  setTeamOverview: (data: TeamOverview) => void;
  addTeamMember: (member: Omit<TeamMember, "id">) => void;
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  deleteTeamMembers: (ids: string[]) => void;
  updateStrategy: (data: Partial<StrategyData>) => void;
  setStrategy: (data: StrategyData) => void;
}

const initialBio: BioData = {
  fullName: "",
  preferredName: "",
  currentFirm: "",
  currentTitle: "",
  barYear: "",
  barState: "",
  practiceYears: "",
  practiceAreas: "",
  biography: "",
};

const initialTeamOverview: TeamOverview = {
  totalTeamSize: "",
  associates: "",
  staff: "",
};

const initialStrategy: StrategyData = {
  whyDentons: "",
  growthStrategy: "",
  practiceAreas: [],
  regions: [],
  referralSource: "",
  additionalComments: "",
};

const initialBillings: HistoricalBilling[] = [
  {
    id: "1",
    client: "Global Tech Inc.",
    matter: "M&A Advisory",
    year1: 1250000,
    year2: 1500000,
    year3: 1750000,
  },
  {
    id: "2",
    client: "Innovate Pharma",
    matter: "Patent Litigation",
    year1: 850000,
    year2: 920000,
    year3: 1100000,
  },
  {
    id: "3",
    client: "National Bank Corp",
    matter: "Regulatory Compliance",
    year1: 750000,
    year2: 800000,
    year3: 825000,
  },
];

const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Jennifer Chen",
    title: "Senior Associate",
    yearsWithPartner: 5,
    expectedToJoin: "Yes",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    title: "Associate",
    yearsWithPartner: 3,
    expectedToJoin: "Yes",
  },
  {
    id: "3",
    name: "Emily Thompson",
    title: "Paralegal",
    yearsWithPartner: 4,
    expectedToJoin: "Undecided",
  },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      bio: initialBio,
      billings: initialBillings,
      portableClients: [],
      teamOverview: initialTeamOverview,
      teamMembers: initialTeamMembers,
      strategy: initialStrategy,
      completedSteps: [],

      updateBio: (data) =>
        set((state) => ({ bio: { ...state.bio, ...data } })),

      setBio: (data) => set({ bio: data }),

      markStepCompleted: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.includes(step)
            ? state.completedSteps
            : [...state.completedSteps, step],
        })),

      isStepCompleted: (step) => get().completedSteps.includes(step),

      isStepAccessible: (step) => {
        const stepIndex = STEP_ORDER.indexOf(step);
        if (stepIndex === 0) return true;
        const previousStep = STEP_ORDER[stepIndex - 1];
        return get().completedSteps.includes(previousStep);
      },

      getNextIncompleteStep: () => {
        const completed = get().completedSteps;
        for (const step of STEP_ORDER) {
          if (!completed.includes(step)) {
            const stepIndex = STEP_ORDER.indexOf(step);
            if (stepIndex === 0) return step;
            const previousStep = STEP_ORDER[stepIndex - 1];
            if (completed.includes(previousStep)) return step;
            return STEP_ORDER[0];
          }
        }
        return STEP_ORDER[STEP_ORDER.length - 1];
      },

      addBilling: (billing) =>
        set((state) => ({
          billings: [...state.billings, { ...billing, id: generateId() }],
        })),

      updateBilling: (id, billing) =>
        set((state) => ({
          billings: state.billings.map((b) =>
            b.id === id ? { ...b, ...billing } : b
          ),
        })),

      deleteBilling: (id) =>
        set((state) => ({
          billings: state.billings.filter((b) => b.id !== id),
        })),

      deleteBillings: (ids) =>
        set((state) => ({
          billings: state.billings.filter((b) => !ids.includes(b.id)),
        })),

      addPortableClient: (client) =>
        set((state) => ({
          portableClients: [
            ...state.portableClients,
            { ...client, id: generateId() },
          ],
        })),

      updatePortableClient: (id, client) =>
        set((state) => ({
          portableClients: state.portableClients.map((c) =>
            c.id === id ? { ...c, ...client } : c
          ),
        })),

      deletePortableClient: (id) =>
        set((state) => ({
          portableClients: state.portableClients.filter((c) => c.id !== id),
        })),

      deletePortableClients: (ids) =>
        set((state) => ({
          portableClients: state.portableClients.filter(
            (c) => !ids.includes(c.id)
          ),
        })),

      updateTeamOverview: (data) =>
        set((state) => ({ teamOverview: { ...state.teamOverview, ...data } })),

      setTeamOverview: (data) => set({ teamOverview: data }),

      addTeamMember: (member) =>
        set((state) => ({
          teamMembers: [...state.teamMembers, { ...member, id: generateId() }],
        })),

      updateTeamMember: (id, member) =>
        set((state) => ({
          teamMembers: state.teamMembers.map((m) =>
            m.id === id ? { ...m, ...member } : m
          ),
        })),

      deleteTeamMember: (id) =>
        set((state) => ({
          teamMembers: state.teamMembers.filter((m) => m.id !== id),
        })),

      deleteTeamMembers: (ids) =>
        set((state) => ({
          teamMembers: state.teamMembers.filter((m) => !ids.includes(m.id)),
        })),

      updateStrategy: (data) =>
        set((state) => ({ strategy: { ...state.strategy, ...data } })),

      setStrategy: (data) => set({ strategy: data }),
    }),
    {
      name: "dentons-application-storage",
    }
  )
);
