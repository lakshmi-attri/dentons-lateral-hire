export type ApplicationType = "individual" | "group";

export type ApplicationStatus = "draft" | "submitted";

export type AliasType = "alias" | "former_name" | "nickname";

export type PreferredContact = "phone" | "email";

export type InstitutionType =
  | "law_school"
  | "undergraduate"
  | "graduate"
  | "other";

export type PartnerType =
  | "equity"
  | "non_equity"
  | "income"
  | "counsel"
  | "other";

export type FiscalYearType = "calendar" | "fiscal";

export type LikelihoodLevel = "high" | "medium" | "low";

export type ExpectedToJoin = "yes" | "no" | "undecided";

export type RepresentedBy = "you" | "your_firm";

export type OrganizationType = "501c3" | "for_profit" | "other";

export interface ContactInfo {
  legalFirstName: string;
  legalMiddleName: string;
  legalLastName: string;
  alias: string;
  aliasType: AliasType | null;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  personalEmail: string;
  personalPhone: string;
  preferredContact: PreferredContact;
  currentPractice: string;
  reasonForDentons: string;
}

export interface EducationEntry {
  id: string;
  type: InstitutionType;
  institutionName: string;
  degree: string;
  graduationYear: string;
}

export interface BarAdmission {
  id: string;
  stateOrCourt: string;
  barNumber: string;
  admissionDate: string;
  isActive: boolean;
  inGoodStanding: boolean;
}

export interface ProfessionalOrg {
  id: string;
  name: string;
  role: string;
}

export interface EducationData {
  education: EducationEntry[];
  barAdmissions: BarAdmission[];
  professionalOrgs: ProfessionalOrg[];
}

export interface WorkPosition {
  id: string;
  firmName: string;
  location: string;
  title: string;
  startDate: string;
  endDate: string;
  reasonForLeaving: string;
}

export interface WorkHistoryData {
  currentPosition: {
    firmName: string;
    location: string;
    title: string;
    partnerType: PartnerType | null;
    startDate: string;
    reasonForMove: string;
  };
  priorPositions: WorkPosition[];
  plannedTimeOff: boolean;
  timeOffDetails: string;
  expectedNoticePeriod: string;
  everAskedToLeave: boolean;
  askedToLeaveDetails: string;
}

export interface YearlyFinancialData {
  year2022: number;
  year2023: number;
  year2024: number;
  year2025YTD: number;
}

export interface TimekeeperData {
  totalBillableHours: YearlyFinancialData;
  hoursOriginatedByYou: YearlyFinancialData;
  nonBillableHours: YearlyFinancialData;
  standardHourlyRate: YearlyFinancialData;
  effectiveBillRate: YearlyFinancialData;
}

export interface BillingsCollectionsData {
  billings: YearlyFinancialData;
  collections: YearlyFinancialData;
}

export interface AdditionalFinancialInfo {
  fiscalYearType: FiscalYearType;
  fiscalYearExplanation: string;
  unbilledFeesYearEnd: number;
  uncollectedBilledFees: number;
  uncollectedExplanation: string;
  originationCreditMethod: string;
  canIncreaseRate: boolean;
  newRateIfYes: number;
  clientRateRestrictions: boolean;
  restrictionsDetail: string;
}

export interface AnticipatedCollections {
  lowEstimate: number;
  baseEstimate: number;
  highEstimate: number;
  higherThanHistoricalExplanation: string;
}

export interface CompensationData {
  compensationExpectations: number;
  bonusExpectations: number;
  businessDevelopmentBudget: number;
  practiceExpenditures: string;
}

export interface FinancialsData {
  timekeeper: TimekeeperData;
  billingsCollections: BillingsCollectionsData;
  additionalInfo: AdditionalFinancialInfo;
  anticipatedCollections: AnticipatedCollections;
  compensation: CompensationData;
}

export interface Matter {
  id: string;
  matterName: string;
  matterDescription: string;
  adverseParties: string;
  howAdverseInvolved: string;
}

export interface ClientFinancialHistory {
  billings: YearlyFinancialData;
  collections: YearlyFinancialData;
}

export interface ClientAnticipatedCollections {
  lowEstimate: number;
  baseEstimate: number;
  highEstimate: number;
}

export interface PortableClient {
  id: string;
  clientName: string;
  keyContactName: string;
  keyContactTitle: string;
  keyContactEmail: string;
  affiliatesSubsidiaries: string;
  yearsRepresented: number;
  portableWithin30Days: boolean;
  numberOfOpenMatters: number;
  workDescription: string;
  staffingDescription: string;
  billRateForClient: number;
  matters: Matter[];
  financialHistory: ClientFinancialHistory;
  anticipatedCollections: ClientAnticipatedCollections;
}

export interface ClientAdverseToDentons {
  id: string;
  dentonsRepresentedEntity: string;
  matterDescription: string;
  datesOfInvolvement: string;
  yourRole: string;
}

export interface PriorClient {
  id: string;
  clientName: string;
  natureOfWork: string;
}

export interface ProspectiveClient {
  id: string;
  clientName: string;
  natureOfOpportunity: string;
  adverseEntities: string;
}

export interface ProBonoWork {
  description: string;
  hasProBonoWork: boolean;
}

export interface ConflictsData {
  adverseToDentons: ClientAdverseToDentons[];
  hasNoAdverseMatters: boolean;
  priorClients: PriorClient[];
  prospectiveClients: ProspectiveClient[];
  proBonoWork: ProBonoWork;
}

export interface BoardMembership {
  id: string;
  organizationName: string;
  datesOfService: string;
  natureOfOrganization: string;
  anticipateContinuing: boolean;
  legalClaimsPending: boolean;
  hasDOCoverage: boolean;
  performedLegalServices: boolean;
  anticipatePerformingLegalServices: boolean;
  anticipateClientOfDentons: boolean;
  receiveCompensation: boolean;
  compensationDetails: string;
}

export interface DueDiligenceData {
  // For-Profit Enterprise
  forProfitOwnership: boolean;
  forProfitDetails: string;
  
  // Public Office
  publicOffice: boolean;
  publicOfficeDetails: string;
  
  // Business Relationships
  businessRelationships: boolean;
  businessRelationshipsDetails: string;
  
  // Tax Returns
  failedToFileTaxReturns: boolean;
  failedToFileTaxReturnsDetails: string;
  
  failedToPayTaxes: boolean;
  failedToPayTaxesDetails: string;
  
  taxAudit: boolean;
  taxAuditDetails: string;
  
  // Financial Issues
  liens: boolean;
  liensDetails: string;
  
  bankruptcy: boolean;
  bankruptcyDetails: string;
  
  // Professional Issues
  disciplinaryProceedings: boolean;
  disciplinaryProceedingsDetails: string;
  
  litigation: boolean;
  litigationDetails: string;
  
  malpracticeClaims: boolean;
  malpracticeClaimsDetails: string;
  
  falseStatementClaims: boolean;
  falseStatementClaimsDetails: string;
  
  potentialClaims: boolean;
  potentialClaimsDetails: string;
  
  investigations: boolean;
  investigationsDetails: string;
  
  debarment: boolean;
  debarmentDetails: string;
  
  // Board Memberships
  boardMemberships: BoardMembership[];
  
  // Work Eligibility
  legallyEligibleToWork: boolean;
  requiresVisaSponsorship: boolean;
}

export interface Reference {
  name: string;
  title: string;
  company: string;
  businessType: string;
  phone: string;
  email: string;
  mayContactPreOffer: boolean;
}

export interface RecruiterInfo {
  representedByRecruiter: boolean;
  recruiterName: string;
  recruiterFirm: string;
  recruiterPhone: string;
  recruiterEmail: string;
  soleRepresentative: boolean;
}

export interface ReferencesData {
  reference1: Reference;
  reference2: Reference;
  reference3: Reference;
  recruiter: RecruiterInfo;
}

export interface AcknowledgmentData {
  certifyTrueAndComplete: boolean;
  understandMaterialChanges: boolean;
  candidateSignature: string;
  signatureDate: string;
  representedByRecruiter: boolean;
  recruiterName: string;
  recruiterPhone: string;
  recruiterEmail: string;
  confirmSoleRepresentation: boolean;
}

export interface GroupOverviewData {
  firmName: string;
  firmStructure: string;
  yearEstablished: number | null;
  totalPartnersInFirm: number;
  partnersJoiningDentons: number;
  totalAssociates: number;
  associatesJoining: number;
  totalStaff: number;
  staffJoining: number;
  currentOfficeLocations: string[];
  primaryPracticeAreas: string[];
  reasonForTransition: string;
  integrationTimeline: string;
}

export interface PartnerProfile {
  id: string;
  fullLegalName: string;
  email: string;
  phone: string;
  currentTitle: string;
  partnerType: PartnerType;
  primaryBarAdmission: string;
  barNumber: string;
  yearsAtCurrentFirm: number;
  primaryPracticeArea: string;
  billings2022: number;
  billings2023: number;
  billings2024: number;
  portableBookEstimate: number;
  compensationExpectation: number;
  completeFullLCQSeparately: boolean;
}

export interface AssociateMember {
  id: string;
  fullName: string;
  email: string;
  currentTitle: string;
  barAdmissions: string;
  yearsOfExperience: number;
  practiceArea: string;
  currentCompensation: number;
  expectedToJoin: ExpectedToJoin;
  billableRate: number;
}

export interface StaffMember {
  id: string;
  fullName: string;
  currentTitle: string;
  yearsWithFirm: number;
  currentCompensation: number;
  expectedToJoin: ExpectedToJoin;
}

export interface TeamMemberData {
  associates: AssociateMember[];
  staff: StaffMember[];
}

export interface CombinedFinancialsData {
  combinedLowEstimate: number;
  combinedBaseEstimate: number;
  combinedHighEstimate: number;
  totalAnnualPayroll: number;
  partnerDrawTotal: number;
  associateSalariesTotal: number;
  staffSalariesTotal: number;
  officeSpaceRequirements: string;
  technologyITNeeds: string;
  otherInfrastructure: string;
}

export const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "District of Columbia",
] as const;

export const PRACTICE_AREAS = [
  "Antitrust/Competition",
  "Appellate",
  "Banking & Finance",
  "Bankruptcy & Restructuring",
  "Capital Markets",
  "Commercial Litigation",
  "Corporate/M&A",
  "Employee Benefits & Executive Compensation",
  "Energy",
  "Environmental",
  "FDA/Life Sciences",
  "Government Contracts",
  "Healthcare",
  "Immigration",
  "Insurance",
  "Intellectual Property",
  "International Trade",
  "Labor & Employment",
  "Private Equity",
  "Real Estate",
  "Securities",
  "Tax",
  "Technology",
  "White Collar Defense",
] as const;

export const REGIONS = [
  "Northeast",
  "Southeast",
  "Midwest",
  "Southwest",
  "West Coast",
  "International - Europe",
  "International - Asia",
  "International - Latin America",
  "International - Middle East",
  "International - Africa",
] as const;

export const INDIVIDUAL_STEPS = [
  { path: "/application", label: "Application Type", shortLabel: "Type" },
  {
    path: "/application/contact",
    label: "Contact Information",
    shortLabel: "Contact",
  },
  {
    path: "/application/education",
    label: "Education & Admissions",
    shortLabel: "Education",
  },
  {
    path: "/application/work-history",
    label: "Work History",
    shortLabel: "Work",
  },
  {
    path: "/application/financials",
    label: "Financial Snapshot",
    shortLabel: "Financials",
  },
  {
    path: "/application/clients",
    label: "Portable Clients",
    shortLabel: "Clients",
  },
  {
    path: "/application/conflicts",
    label: "Conflicts Information",
    shortLabel: "Conflicts",
  },
  {
    path: "/application/due-diligence",
    label: "Due Diligence",
    shortLabel: "Due Diligence",
  },
  {
    path: "/application/references",
    label: "References",
    shortLabel: "References",
  },
  {
    path: "/application/review",
    label: "Review & Submit",
    shortLabel: "Review",
  },
] as const;

export const GROUP_STEPS = [
  { path: "/application", label: "Application Type", shortLabel: "Type" },
  {
    path: "/application/contact",
    label: "Contact Information",
    shortLabel: "Contact",
  },
  {
    path: "/application/group-overview",
    label: "Group Overview",
    shortLabel: "Group",
  },
  {
    path: "/application/partners",
    label: "Additional Partners",
    shortLabel: "Partners",
  },
  {
    path: "/application/team-members",
    label: "Team Members",
    shortLabel: "Team",
  },
  {
    path: "/application/education",
    label: "Education & Admissions",
    shortLabel: "Education",
  },
  {
    path: "/application/work-history",
    label: "Work History",
    shortLabel: "Work",
  },
  {
    path: "/application/financials",
    label: "Financial Snapshot",
    shortLabel: "Financials",
  },
  {
    path: "/application/clients",
    label: "Portable Clients",
    shortLabel: "Clients",
  },
  {
    path: "/application/conflicts",
    label: "Conflicts Information",
    shortLabel: "Conflicts",
  },
  {
    path: "/application/due-diligence",
    label: "Due Diligence",
    shortLabel: "Due Diligence",
  },
  {
    path: "/application/references",
    label: "References",
    shortLabel: "References",
  },
  {
    path: "/application/combined-financials",
    label: "Combined Financials",
    shortLabel: "Combined",
  },
  {
    path: "/application/review",
    label: "Review & Submit",
    shortLabel: "Review",
  },
] as const;

export type IndividualStepPath = (typeof INDIVIDUAL_STEPS)[number]["path"];
export type GroupStepPath = (typeof GROUP_STEPS)[number]["path"];
export type StepPath = IndividualStepPath | GroupStepPath;
