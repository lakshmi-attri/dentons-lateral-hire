import { z } from "zod";

export const boardMembershipSchema = z.object({
  id: z.string(),
  organizationName: z.string().min(2, "Organization name is required"),
  datesOfService: z.string().min(4, "Dates of service are required"),
  natureOfOrganization: z.string().min(10, "Nature of organization is required"),
  anticipateContinuing: z.boolean(),
  legalClaimsPending: z.boolean(),
  hasDOCoverage: z.boolean(),
  performedLegalServices: z.boolean(),
  anticipatePerformingLegalServices: z.boolean(),
  anticipateClientOfDentons: z.boolean(),
  receiveCompensation: z.boolean(),
  compensationDetails: z.string().optional().default(""),
});

export const dueDiligenceSchema = z.object({
  // For-Profit Enterprise
  forProfitOwnership: z.boolean(),
  forProfitDetails: z.string().optional().default(""),
  
  // Public Office
  publicOffice: z.boolean(),
  publicOfficeDetails: z.string().optional().default(""),
  
  // Business Relationships
  businessRelationships: z.boolean(),
  businessRelationshipsDetails: z.string().optional().default(""),
  
  // Tax Returns
  failedToFileTaxReturns: z.boolean(),
  failedToFileTaxReturnsDetails: z.string().optional().default(""),
  
  failedToPayTaxes: z.boolean(),
  failedToPayTaxesDetails: z.string().optional().default(""),
  
  taxAudit: z.boolean(),
  taxAuditDetails: z.string().optional().default(""),
  
  // Financial Issues
  liens: z.boolean(),
  liensDetails: z.string().optional().default(""),
  
  bankruptcy: z.boolean(),
  bankruptcyDetails: z.string().optional().default(""),
  
  // Professional Issues
  disciplinaryProceedings: z.boolean(),
  disciplinaryProceedingsDetails: z.string().optional().default(""),
  
  litigation: z.boolean(),
  litigationDetails: z.string().optional().default(""),
  
  malpracticeClaims: z.boolean(),
  malpracticeClaimsDetails: z.string().optional().default(""),
  
  falseStatementClaims: z.boolean(),
  falseStatementClaimsDetails: z.string().optional().default(""),
  
  potentialClaims: z.boolean(),
  potentialClaimsDetails: z.string().optional().default(""),
  
  investigations: z.boolean(),
  investigationsDetails: z.string().optional().default(""),
  
  debarment: z.boolean(),
  debarmentDetails: z.string().optional().default(""),
  
  // Board Memberships
  boardMemberships: z.array(boardMembershipSchema),
  
  // Work Eligibility
  legallyEligibleToWork: z.boolean(),
  requiresVisaSponsorship: z.boolean(),
}).superRefine((data, ctx) => {
  // Validate that details are provided when answer is yes
  const validations = [
    { field: data.forProfitOwnership, path: "forProfitDetails", details: data.forProfitDetails },
    { field: data.publicOffice, path: "publicOfficeDetails", details: data.publicOfficeDetails },
    { field: data.businessRelationships, path: "businessRelationshipsDetails", details: data.businessRelationshipsDetails },
    { field: data.failedToFileTaxReturns, path: "failedToFileTaxReturnsDetails", details: data.failedToFileTaxReturnsDetails },
    { field: data.failedToPayTaxes, path: "failedToPayTaxesDetails", details: data.failedToPayTaxesDetails },
    { field: data.taxAudit, path: "taxAuditDetails", details: data.taxAuditDetails },
    { field: data.liens, path: "liensDetails", details: data.liensDetails },
    { field: data.bankruptcy, path: "bankruptcyDetails", details: data.bankruptcyDetails },
    { field: data.disciplinaryProceedings, path: "disciplinaryProceedingsDetails", details: data.disciplinaryProceedingsDetails },
    { field: data.litigation, path: "litigationDetails", details: data.litigationDetails },
    { field: data.malpracticeClaims, path: "malpracticeClaimsDetails", details: data.malpracticeClaimsDetails },
    { field: data.falseStatementClaims, path: "falseStatementClaimsDetails", details: data.falseStatementClaimsDetails },
    { field: data.potentialClaims, path: "potentialClaimsDetails", details: data.potentialClaimsDetails },
    { field: data.investigations, path: "investigationsDetails", details: data.investigationsDetails },
    { field: data.debarment, path: "debarmentDetails", details: data.debarmentDetails },
  ];

  validations.forEach(({ field, path, details }) => {
    if (field && (!details || details.length < 10)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide details (minimum 10 characters)",
        path: [path],
      });
    }
  });
  
  if (!data.legallyEligibleToWork) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "You must be legally eligible to work in the United States",
      path: ["legallyEligibleToWork"],
    });
  }
});

export const addBoardMembershipSchema = boardMembershipSchema.omit({ id: true });

export type BoardMembershipFormData = z.infer<typeof boardMembershipSchema>;
export type DueDiligenceFormData = z.infer<typeof dueDiligenceSchema>;
