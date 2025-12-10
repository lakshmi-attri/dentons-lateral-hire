import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ApplicationType,
  ContactInfo,
  EducationData,
  EducationEntry,
  BarAdmission,
  ProfessionalOrg,
  WorkHistoryData,
  FinancialsData,
  PortableClient,
  Matter,
  ConflictsData,
  ClientAdverseToDentons,
  PriorClient,
  ProspectiveClient,
  ProBonoWork,
  DueDiligenceData,
  BoardMembership,
  ReferencesData,
  AcknowledgmentData,
  GroupOverviewData,
  PartnerProfile,
  TeamMemberData,
  AssociateMember,
  StaffMember,
  CombinedFinancialsData,
  INDIVIDUAL_STEPS,
  GROUP_STEPS,
} from "@/types/lcq";
import { generateId } from "@/lib/uuid";
import { storage } from "@/lib/storage";
import { statusMachine } from "@/lib/status-machine";
import type { ApplicationStatus, ApplicationStatusHistory, Application } from "@/types/application";

const INDIVIDUAL_STEP_PATHS = [
  "/application",
  "/application/contact",
  "/application/education",
  "/application/work-history",
  "/application/financials",
  "/application/clients",
  "/application/conflicts",
  "/application/due-diligence",
  "/application/references",
  "/application/review",
] as const;

const GROUP_STEP_PATHS = [
  "/application",
  "/application/contact",
  "/application/group-overview",
  "/application/partners",
  "/application/team-members",
  "/application/education",
  "/application/work-history",
  "/application/financials",
  "/application/clients",
  "/application/conflicts",
  "/application/due-diligence",
  "/application/references",
  "/application/combined-financials",
  "/application/review",
] as const;

const initialContactInfo: ContactInfo = {
  legalFirstName: "",
  legalMiddleName: "",
  legalLastName: "",
  alias: "",
  aliasType: null,
  streetAddress: "",
  city: "",
  state: "",
  zipCode: "",
  personalEmail: "",
  personalPhone: "",
  preferredContact: "email",
  currentPractice: "",
  reasonForDentons: "",
};

const initialEducationData: EducationData = {
  education: [],
  barAdmissions: [],
  professionalOrgs: [],
};

const initialWorkHistoryData: WorkHistoryData = {
  currentPosition: {
    firmName: "",
    location: "",
    title: "",
    partnerType: null,
    startDate: "",
    reasonForMove: "",
  },
  priorPositions: [],
  plannedTimeOff: false,
  timeOffDetails: "",
  expectedNoticePeriod: "",
  everAskedToLeave: false,
  askedToLeaveDetails: "",
};

const initialFinancialsData: FinancialsData = {
  timekeeper: {
    totalBillableHours: {
      year2022: 0,
      year2023: 0,
      year2024: 0,
      year2025YTD: 0,
    },
    hoursOriginatedByYou: {
      year2022: 0,
      year2023: 0,
      year2024: 0,
      year2025YTD: 0,
    },
    nonBillableHours: { year2022: 0, year2023: 0, year2024: 0, year2025YTD: 0 },
    standardHourlyRate: {
      year2022: 0,
      year2023: 0,
      year2024: 0,
      year2025YTD: 0,
    },
    effectiveBillRate: {
      year2022: 0,
      year2023: 0,
      year2024: 0,
      year2025YTD: 0,
    },
  },
  billingsCollections: {
    billings: { year2022: 0, year2023: 0, year2024: 0, year2025YTD: 0 },
    collections: { year2022: 0, year2023: 0, year2024: 0, year2025YTD: 0 },
  },
  additionalInfo: {
    fiscalYearType: "calendar",
    fiscalYearExplanation: "",
    unbilledFeesYearEnd: 0,
    uncollectedBilledFees: 0,
    uncollectedExplanation: "",
    originationCreditMethod: "",
    canIncreaseRate: false,
    newRateIfYes: 0,
    clientRateRestrictions: false,
    restrictionsDetail: "",
  },
  anticipatedCollections: {
    lowEstimate: 0,
    baseEstimate: 0,
    highEstimate: 0,
    higherThanHistoricalExplanation: "",
  },
  compensation: {
    compensationExpectations: 0,
    bonusExpectations: 0,
    businessDevelopmentBudget: 0,
    practiceExpenditures: "",
  },
};

const initialConflictsData: ConflictsData = {
  adverseToDentons: [],
  hasNoAdverseMatters: false,
  priorClients: [],
  prospectiveClients: [],
  proBonoWork: {
    description: "",
    hasProBonoWork: false,
  },
};

const initialDueDiligenceData: DueDiligenceData = {
  forProfitOwnership: false,
  forProfitDetails: "",
  publicOffice: false,
  publicOfficeDetails: "",
  businessRelationships: false,
  businessRelationshipsDetails: "",
  failedToFileTaxReturns: false,
  failedToFileTaxReturnsDetails: "",
  failedToPayTaxes: false,
  failedToPayTaxesDetails: "",
  taxAudit: false,
  taxAuditDetails: "",
  liens: false,
  liensDetails: "",
  bankruptcy: false,
  bankruptcyDetails: "",
  disciplinaryProceedings: false,
  disciplinaryProceedingsDetails: "",
  litigation: false,
  litigationDetails: "",
  malpracticeClaims: false,
  malpracticeClaimsDetails: "",
  falseStatementClaims: false,
  falseStatementClaimsDetails: "",
  potentialClaims: false,
  potentialClaimsDetails: "",
  investigations: false,
  investigationsDetails: "",
  debarment: false,
  debarmentDetails: "",
  boardMemberships: [],
  legallyEligibleToWork: false,
  requiresVisaSponsorship: false,
};

const initialReference = {
  name: "",
  title: "",
  company: "",
  businessType: "",
  phone: "",
  email: "",
  mayContactPreOffer: false,
};

const initialReferencesData: ReferencesData = {
  reference1: { ...initialReference },
  reference2: { ...initialReference },
  reference3: { ...initialReference },
  recruiter: {
    representedByRecruiter: false,
    recruiterName: "",
    recruiterFirm: "",
    recruiterPhone: "",
    recruiterEmail: "",
    soleRepresentative: false,
  },
};

const initialAcknowledgmentData: AcknowledgmentData = {
  certifyTrueAndComplete: false,
  understandMaterialChanges: false,
  candidateSignature: "",
  signatureDate: "",
  representedByRecruiter: false,
  recruiterName: "",
  recruiterPhone: "",
  recruiterEmail: "",
  confirmSoleRepresentation: false,
};

const initialGroupOverviewData: GroupOverviewData = {
  firmName: "",
  firmStructure: "",
  yearEstablished: null,
  totalPartnersInFirm: 0,
  partnersJoiningDentons: 0,
  totalAssociates: 0,
  associatesJoining: 0,
  totalStaff: 0,
  staffJoining: 0,
  currentOfficeLocations: [],
  primaryPracticeAreas: [],
  reasonForTransition: "",
  integrationTimeline: "",
};

const initialTeamMemberData: TeamMemberData = {
  associates: [],
  staff: [],
};

const initialCombinedFinancialsData: CombinedFinancialsData = {
  combinedLowEstimate: 0,
  combinedBaseEstimate: 0,
  combinedHighEstimate: 0,
  totalAnnualPayroll: 0,
  partnerDrawTotal: 0,
  associateSalariesTotal: 0,
  staffSalariesTotal: 0,
  officeSpaceRequirements: "",
  technologyITNeeds: "",
  otherInfrastructure: "",
};

export interface LCQStore {
  applicationId: string | null;
  userId: string | null;
  applicationType: ApplicationType | null;
  applicationTypeLocked: boolean;
  status: ApplicationStatus;
  statusHistory: ApplicationStatusHistory[];
  createdAt: string | null;
  updatedAt: string | null;
  currentStep: string;
  completedSteps: string[];
  isDirty: boolean;
  lastSaved: Date | null;

  contactInfo: ContactInfo;
  education: EducationData;
  workHistory: WorkHistoryData;
  financials: FinancialsData;
  portableClients: PortableClient[];
  conflicts: ConflictsData;
  dueDiligence: DueDiligenceData;
  references: ReferencesData;
  acknowledgment: AcknowledgmentData;

  groupOverview: GroupOverviewData;
  additionalPartners: PartnerProfile[];
  teamMembers: TeamMemberData;
  combinedFinancials: CombinedFinancialsData;

  setApplicationType: (type: ApplicationType) => void;
  setCurrentStep: (step: string) => void;
  markStepComplete: (step: string) => void;
  unmarkStepComplete: (step: string) => void;
  isStepComplete: (step: string) => boolean;
  isStepAccessible: (step: string) => boolean;
  getNextIncompleteStep: () => string;
  getStepOrder: () => string[];
  getStepIndex: (step: string) => number;

  updateContactInfo: (data: Partial<ContactInfo>) => void;
  setContactInfo: (data: ContactInfo) => void;

  updateEducation: (data: Partial<EducationData>) => void;
  addEducationEntry: (item: Omit<EducationEntry, "id">) => void;
  updateEducationEntry: (id: string, item: Partial<EducationEntry>) => void;
  deleteEducationEntry: (id: string) => void;
  addBarAdmission: (item: Omit<BarAdmission, "id">) => void;
  updateBarAdmission: (id: string, item: Partial<BarAdmission>) => void;
  deleteBarAdmission: (id: string) => void;
  addProfessionalOrg: (item: Omit<ProfessionalOrg, "id">) => void;
  updateProfessionalOrg: (id: string, item: Partial<ProfessionalOrg>) => void;
  deleteProfessionalOrg: (id: string) => void;

  updateWorkHistory: (data: Partial<WorkHistoryData>) => void;
  setWorkHistory: (data: WorkHistoryData) => void;

  updateFinancials: (data: Partial<FinancialsData>) => void;
  setFinancials: (data: FinancialsData) => void;

  addPortableClient: (item: Omit<PortableClient, "id" | "matters">) => void;
  updatePortableClient: (id: string, item: Partial<PortableClient>) => void;
  deletePortableClient: (id: string) => void;
  addMatterToClient: (clientId: string, matter: Omit<Matter, "id">) => void;
  updateMatter: (
    clientId: string,
    matterId: string,
    item: Partial<Matter>
  ) => void;
  deleteMatter: (clientId: string, matterId: string) => void;

  updateConflicts: (data: Partial<ConflictsData>) => void;
  addClientAdverseToDentons: (item: Omit<ClientAdverseToDentons, "id">) => void;
  updateClientAdverseToDentons: (
    id: string,
    item: Partial<ClientAdverseToDentons>
  ) => void;
  deleteClientAdverseToDentons: (id: string) => void;
  addPriorClient: (item: Omit<PriorClient, "id">) => void;
  updatePriorClient: (id: string, item: Partial<PriorClient>) => void;
  deletePriorClient: (id: string) => void;
  addProspectiveClient: (item: Omit<ProspectiveClient, "id">) => void;
  updateProspectiveClient: (
    id: string,
    item: Partial<ProspectiveClient>
  ) => void;
  deleteProspectiveClient: (id: string) => void;
  updateProBonoWork: (data: Partial<ProBonoWork>) => void;

  updateDueDiligence: (data: Partial<DueDiligenceData>) => void;
  setDueDiligence: (data: DueDiligenceData) => void;
  addBoardMembership: (item: Omit<BoardMembership, "id">) => void;
  updateBoardMembership: (id: string, item: Partial<BoardMembership>) => void;
  deleteBoardMembership: (id: string) => void;

  updateReferences: (data: Partial<ReferencesData>) => void;
  setReferences: (data: ReferencesData) => void;

  updateAcknowledgment: (data: Partial<AcknowledgmentData>) => void;
  setAcknowledgment: (data: AcknowledgmentData) => void;

  updateGroupOverview: (data: Partial<GroupOverviewData>) => void;
  setGroupOverview: (data: GroupOverviewData) => void;

  addPartner: (item: Omit<PartnerProfile, "id">) => void;
  updatePartner: (id: string, item: Partial<PartnerProfile>) => void;
  deletePartner: (id: string) => void;

  updateTeamMembers: (data: Partial<TeamMemberData>) => void;
  addAssociate: (item: Omit<AssociateMember, "id">) => void;
  updateAssociate: (id: string, item: Partial<AssociateMember>) => void;
  deleteAssociate: (id: string) => void;
  addStaffMember: (item: Omit<StaffMember, "id">) => void;
  updateStaffMember: (id: string, item: Partial<StaffMember>) => void;
  deleteStaffMember: (id: string) => void;

  updateCombinedFinancials: (data: Partial<CombinedFinancialsData>) => void;
  setCombinedFinancials: (data: CombinedFinancialsData) => void;

  resetApplication: () => void;
  getCompletionPercentage: () => number;
  markDirty: () => void;
  markClean: () => void;

  lockApplicationType: () => void;
  canChangeApplicationType: () => boolean;
  initializeApplication: (userId: string, applicationType: ApplicationType) => string;
  submitApplication: () => void;
  saveAsDraft: () => void;
  loadApplication: (applicationId: string) => void;
  persistToStorage: () => void;
}

export const useLCQStore = create<LCQStore>()(
  persist(
    (set, get) => ({
      applicationId: null,
      userId: null,
      applicationType: null,
      applicationTypeLocked: false,
      status: 'draft',
      statusHistory: [],
      createdAt: null,
      updatedAt: null,
      currentStep: "/application",
      completedSteps: [],
      isDirty: false,
      lastSaved: null,

      contactInfo: initialContactInfo,
      education: initialEducationData,
      workHistory: initialWorkHistoryData,
      financials: initialFinancialsData,
      portableClients: [],
      conflicts: initialConflictsData,
      dueDiligence: initialDueDiligenceData,
      references: initialReferencesData,
      acknowledgment: initialAcknowledgmentData,

      groupOverview: initialGroupOverviewData,
      additionalPartners: [],
      teamMembers: initialTeamMemberData,
      combinedFinancials: initialCombinedFinancialsData,

      setApplicationType: (type) =>
        set({ applicationType: type, isDirty: true, lastSaved: new Date() }),

      setCurrentStep: (step) => set({ currentStep: step }),

      markStepComplete: (step) =>
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])],
          lastSaved: new Date(),
        })),

      unmarkStepComplete: (step) =>
        set((state) => ({
          completedSteps: state.completedSteps.filter((s) => s !== step),
        })),

      isStepComplete: (step) => get().completedSteps.includes(step),

      isStepAccessible: (step) => {
        const steps = get().getStepOrder();
        const stepIndex = steps.indexOf(step);
        if (stepIndex === 0) return true;
        if (stepIndex === -1) return false;
        const previousStep = steps[stepIndex - 1];
        return get().completedSteps.includes(previousStep);
      },

      getNextIncompleteStep: () => {
        const steps = get().getStepOrder();
        const completed = get().completedSteps;
        return (
          steps.find((step) => !completed.includes(step)) ||
          steps[steps.length - 1]
        );
      },

      getStepOrder: () => {
        return get().applicationType === "group"
          ? [...GROUP_STEP_PATHS]
          : [...INDIVIDUAL_STEP_PATHS];
      },

      getStepIndex: (step) => {
        const steps = get().getStepOrder();
        return steps.indexOf(step);
      },

      updateContactInfo: (data) =>
        set((state) => ({
          contactInfo: { ...state.contactInfo, ...data },
          isDirty: true,
          lastSaved: new Date(),
        })),

      setContactInfo: (data) =>
        set({ contactInfo: data, isDirty: true, lastSaved: new Date() }),

      updateEducation: (data) =>
        set((state) => ({
          education: { ...state.education, ...data },
          isDirty: true,
          lastSaved: new Date(),
        })),

      addEducationEntry: (item) =>
        set((state) => ({
          education: {
            ...state.education,
            education: [
              ...state.education.education,
              { ...item, id: generateId() },
            ],
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateEducationEntry: (id, item) =>
        set((state) => ({
          education: {
            ...state.education,
            education: state.education.education.map((e) =>
              e.id === id ? { ...e, ...item } : e
            ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      deleteEducationEntry: (id) =>
        set((state) => ({
          education: {
            ...state.education,
            education: state.education.education.filter((e) => e.id !== id),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      addBarAdmission: (item) =>
        set((state) => ({
          education: {
            ...state.education,
            barAdmissions: [
              ...state.education.barAdmissions,
              { ...item, id: generateId() },
            ],
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateBarAdmission: (id, item) =>
        set((state) => ({
          education: {
            ...state.education,
            barAdmissions: state.education.barAdmissions.map((b) =>
              b.id === id ? { ...b, ...item } : b
            ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      deleteBarAdmission: (id) =>
        set((state) => ({
          education: {
            ...state.education,
            barAdmissions: state.education.barAdmissions.filter(
              (b) => b.id !== id
            ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      addProfessionalOrg: (item) =>
        set((state) => ({
          education: {
            ...state.education,
            professionalOrgs: [
              ...state.education.professionalOrgs,
              { ...item, id: generateId() },
            ],
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateProfessionalOrg: (id, item) =>
        set((state) => ({
          education: {
            ...state.education,
            professionalOrgs: state.education.professionalOrgs.map((p) =>
              p.id === id ? { ...p, ...item } : p
            ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      deleteProfessionalOrg: (id) =>
        set((state) => ({
          education: {
            ...state.education,
            professionalOrgs: state.education.professionalOrgs.filter(
              (p) => p.id !== id
            ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateWorkHistory: (data) =>
        set((state) => ({
          workHistory: { ...state.workHistory, ...data },
          isDirty: true,
          lastSaved: new Date(),
        })),

      setWorkHistory: (data) =>
        set({ workHistory: data, isDirty: true, lastSaved: new Date() }),

      updateFinancials: (data) =>
        set((state) => ({
          financials: { ...state.financials, ...data },
          isDirty: true,
          lastSaved: new Date(),
        })),

      setFinancials: (data) =>
        set({ financials: data, isDirty: true, lastSaved: new Date() }),

      addPortableClient: (item) =>
        set((state) => ({
          portableClients: [
            ...state.portableClients,
            {
              ...item,
              id: generateId(),
              matters: [],
            },
          ],
          isDirty: true,
          lastSaved: new Date(),
        })),

      updatePortableClient: (id, item) =>
        set((state) => ({
          portableClients: state.portableClients.map((c) =>
            c.id === id ? { ...c, ...item } : c
          ),
          isDirty: true,
          lastSaved: new Date(),
        })),

      deletePortableClient: (id) =>
        set((state) => ({
          portableClients: state.portableClients.filter((c) => c.id !== id),
          isDirty: true,
          lastSaved: new Date(),
        })),

      addMatterToClient: (clientId, matter) =>
        set((state) => ({
          portableClients: state.portableClients.map((c) =>
            c.id === clientId
              ? {
                  ...c,
                  matters: [...c.matters, { ...matter, id: generateId() }],
                }
              : c
          ),
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateMatter: (clientId, matterId, item) =>
        set((state) => ({
          portableClients: state.portableClients.map((c) =>
            c.id === clientId
              ? {
                  ...c,
                  matters: c.matters.map((m) =>
                    m.id === matterId ? { ...m, ...item } : m
                  ),
                }
              : c
          ),
          isDirty: true,
          lastSaved: new Date(),
        })),

      deleteMatter: (clientId, matterId) =>
        set((state) => ({
          portableClients: state.portableClients.map((c) =>
            c.id === clientId
              ? { ...c, matters: c.matters.filter((m) => m.id !== matterId) }
              : c
          ),
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateConflicts: (data) =>
        set((state) => ({
          conflicts: { ...state.conflicts, ...data },
          isDirty: true,
          lastSaved: new Date(),
        })),

      addClientAdverseToDentons: (item) =>
        set((state) => ({
          conflicts: {
            ...state.conflicts,
            adverseToDentons: [
              ...state.conflicts.adverseToDentons,
              { ...item, id: generateId() },
            ],
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateClientAdverseToDentons: (id, item) =>
        set((state) => ({
          conflicts: {
            ...state.conflicts,
            adverseToDentons:
              state.conflicts.adverseToDentons.map((c) =>
                c.id === id ? { ...c, ...item } : c
              ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      deleteClientAdverseToDentons: (id) =>
        set((state) => ({
          conflicts: {
            ...state.conflicts,
            adverseToDentons:
              state.conflicts.adverseToDentons.filter(
                (c) => c.id !== id
              ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      addPriorClient: (item) =>
        set((state) => ({
          conflicts: {
            ...state.conflicts,
            priorClients: [
              ...state.conflicts.priorClients,
              { ...item, id: generateId() },
            ],
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      updatePriorClient: (id, item) =>
        set((state) => ({
          conflicts: {
            ...state.conflicts,
            priorClients: state.conflicts.priorClients.map((c) =>
              c.id === id ? { ...c, ...item } : c
            ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      deletePriorClient: (id) =>
        set((state) => ({
          conflicts: {
            ...state.conflicts,
            priorClients: state.conflicts.priorClients.filter(
              (c) => c.id !== id
            ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      addProspectiveClient: (item) =>
        set((state) => ({
          conflicts: {
            ...state.conflicts,
            prospectiveClients: [
              ...state.conflicts.prospectiveClients,
              { ...item, id: generateId() },
            ],
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateProspectiveClient: (id, item) =>
        set((state) => ({
          conflicts: {
            ...state.conflicts,
            prospectiveClients: state.conflicts.prospectiveClients.map((c) =>
              c.id === id ? { ...c, ...item } : c
            ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      deleteProspectiveClient: (id) =>
        set((state) => ({
          conflicts: {
            ...state.conflicts,
            prospectiveClients: state.conflicts.prospectiveClients.filter(
              (c) => c.id !== id
            ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateProBonoWork: (data) =>
        set((state) => ({
          conflicts: {
            ...state.conflicts,
            proBonoWork: { ...state.conflicts.proBonoWork, ...data },
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateDueDiligence: (data) =>
        set((state) => ({
          dueDiligence: { ...state.dueDiligence, ...data },
          isDirty: true,
          lastSaved: new Date(),
        })),

      setDueDiligence: (data) =>
        set({ dueDiligence: data, isDirty: true, lastSaved: new Date() }),

      addBoardMembership: (item) =>
        set((state) => ({
          dueDiligence: {
            ...state.dueDiligence,
            boardMemberships: [
              ...state.dueDiligence.boardMemberships,
              { ...item, id: generateId() },
            ],
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateBoardMembership: (id, item) =>
        set((state) => ({
          dueDiligence: {
            ...state.dueDiligence,
            boardMemberships: state.dueDiligence.boardMemberships.map((b) =>
              b.id === id ? { ...b, ...item } : b
            ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      deleteBoardMembership: (id) =>
        set((state) => ({
          dueDiligence: {
            ...state.dueDiligence,
            boardMemberships: state.dueDiligence.boardMemberships.filter(
              (b) => b.id !== id
            ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateReferences: (data) =>
        set((state) => ({
          references: { ...state.references, ...data },
          isDirty: true,
          lastSaved: new Date(),
        })),

      setReferences: (data) =>
        set({ references: data, isDirty: true, lastSaved: new Date() }),

      updateAcknowledgment: (data) =>
        set((state) => ({
          acknowledgment: { ...state.acknowledgment, ...data },
          isDirty: true,
          lastSaved: new Date(),
        })),

      setAcknowledgment: (data) =>
        set({ acknowledgment: data, isDirty: true, lastSaved: new Date() }),

      updateGroupOverview: (data) =>
        set((state) => ({
          groupOverview: { ...state.groupOverview, ...data },
          isDirty: true,
          lastSaved: new Date(),
        })),

      setGroupOverview: (data) =>
        set({ groupOverview: data, isDirty: true, lastSaved: new Date() }),

      addPartner: (item) =>
        set((state) => ({
          additionalPartners: [
            ...state.additionalPartners,
            { ...item, id: generateId() },
          ],
          isDirty: true,
          lastSaved: new Date(),
        })),

      updatePartner: (id, item) =>
        set((state) => ({
          additionalPartners: state.additionalPartners.map((p) =>
            p.id === id ? { ...p, ...item } : p
          ),
          isDirty: true,
          lastSaved: new Date(),
        })),

      deletePartner: (id) =>
        set((state) => ({
          additionalPartners: state.additionalPartners.filter(
            (p) => p.id !== id
          ),
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateTeamMembers: (data) =>
        set((state) => ({
          teamMembers: { ...state.teamMembers, ...data },
          isDirty: true,
          lastSaved: new Date(),
        })),

      addAssociate: (item) =>
        set((state) => ({
          teamMembers: {
            ...state.teamMembers,
            associates: [
              ...state.teamMembers.associates,
              { ...item, id: generateId() },
            ],
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateAssociate: (id, item) =>
        set((state) => ({
          teamMembers: {
            ...state.teamMembers,
            associates: state.teamMembers.associates.map((a) =>
              a.id === id ? { ...a, ...item } : a
            ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      deleteAssociate: (id) =>
        set((state) => ({
          teamMembers: {
            ...state.teamMembers,
            associates: state.teamMembers.associates.filter((a) => a.id !== id),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      addStaffMember: (item) =>
        set((state) => ({
          teamMembers: {
            ...state.teamMembers,
            staff: [...state.teamMembers.staff, { ...item, id: generateId() }],
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateStaffMember: (id, item) =>
        set((state) => ({
          teamMembers: {
            ...state.teamMembers,
            staff: state.teamMembers.staff.map((s) =>
              s.id === id ? { ...s, ...item } : s
            ),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      deleteStaffMember: (id) =>
        set((state) => ({
          teamMembers: {
            ...state.teamMembers,
            staff: state.teamMembers.staff.filter((s) => s.id !== id),
          },
          isDirty: true,
          lastSaved: new Date(),
        })),

      updateCombinedFinancials: (data) =>
        set((state) => ({
          combinedFinancials: { ...state.combinedFinancials, ...data },
          isDirty: true,
          lastSaved: new Date(),
        })),

      setCombinedFinancials: (data) =>
        set({ combinedFinancials: data, isDirty: true, lastSaved: new Date() }),

      resetApplication: () =>
        set({
          applicationType: null,
          currentStep: "/application",
          completedSteps: [],
          isDirty: false,
          lastSaved: null,
          contactInfo: initialContactInfo,
          education: initialEducationData,
          workHistory: initialWorkHistoryData,
          financials: initialFinancialsData,
          portableClients: [],
          conflicts: initialConflictsData,
          dueDiligence: initialDueDiligenceData,
          references: initialReferencesData,
          acknowledgment: initialAcknowledgmentData,
          groupOverview: initialGroupOverviewData,
          additionalPartners: [],
          teamMembers: initialTeamMemberData,
          combinedFinancials: initialCombinedFinancialsData,
        }),

      getCompletionPercentage: () => {
        const steps = get().getStepOrder();
        const completed = get().completedSteps.length;
        return Math.round((completed / steps.length) * 100);
      },

      markDirty: () => set({ isDirty: true }),

      markClean: () => set({ isDirty: false, lastSaved: new Date() }),

      lockApplicationType: () => {
        set({ applicationTypeLocked: true });
        get().persistToStorage();
      },

      canChangeApplicationType: () => {
        const { completedSteps, applicationTypeLocked } = get();
        return completedSteps.length === 0 && !applicationTypeLocked;
      },

      initializeApplication: (userId, applicationType) => {
        const now = new Date().toISOString();
        const newApplicationId = generateId();
        set({
          applicationId: newApplicationId,
          userId,
          applicationType,
          applicationTypeLocked: false,
          status: 'draft',
          statusHistory: [statusMachine.createStatusHistory(null, 'draft', userId)],
          createdAt: now,
          updatedAt: now,
          currentStep: "/application",
          completedSteps: [],
          isDirty: false,
          lastSaved: new Date(),
          contactInfo: initialContactInfo,
          education: initialEducationData,
          workHistory: initialWorkHistoryData,
          financials: initialFinancialsData,
          portableClients: [],
          conflicts: initialConflictsData,
          dueDiligence: initialDueDiligenceData,
          references: initialReferencesData,
          acknowledgment: initialAcknowledgmentData,
          groupOverview: initialGroupOverviewData,
          additionalPartners: [],
          teamMembers: initialTeamMemberData,
          combinedFinancials: initialCombinedFinancialsData,
        });
        get().persistToStorage();
        return newApplicationId;
      },

      submitApplication: () => {
        const { applicationId, userId, status } = get();
        if (!applicationId || !userId) return;

        if (!statusMachine.canTransitionTo(status, 'submitted')) {
          console.error('Cannot transition from', status, 'to submitted');
          return;
        }

        const newHistory = statusMachine.createStatusHistory(status, 'submitted', userId);

        set(state => ({
          status: 'submitted',
          statusHistory: [...state.statusHistory, newHistory],
          updatedAt: new Date().toISOString(),
        }));

        get().persistToStorage();
      },

      saveAsDraft: () => {
        const state = get();
        if (!state.applicationId || !state.userId) return;

        set({ updatedAt: new Date().toISOString() });
        get().persistToStorage();
      },

      loadApplication: (applicationId) => {
        const applications = storage.get('applications') || [];
        const app = applications.find(a => a.id === applicationId);

        if (!app) {
          console.error('Application not found:', applicationId);
          return;
        }

        set({
          ...app.data,
          applicationId: app.id,
          userId: app.userId,
          status: app.status,
          statusHistory: app.statusHistory,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt,
        });
      },

      persistToStorage: () => {
        const state = get();
        if (!state.applicationId || !state.userId) return;

        const applications = storage.get('applications') || [];
        const existingIndex = applications.findIndex(a => a.id === state.applicationId);

        const application: Application = {
          id: state.applicationId,
          userId: state.userId,
          status: state.status,
          statusHistory: state.statusHistory,
          data: state,
          createdAt: state.createdAt!,
          updatedAt: state.updatedAt!,
        };

        if (existingIndex >= 0) {
          applications[existingIndex] = application;
        } else {
          applications.push(application);
        }

        storage.set('applications', applications);
      },
    }),
    {
      name: "dentons-lcq-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
