"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { WizardNavigation } from "@/components/application/wizard-navigation";
import { useLCQStore } from "@/stores/lcq-store";
import { getNextStep, getPreviousStep } from "@/lib/navigation-helper";
import { useAuthStore } from "@/stores/auth-store";
import type { OrganizationType } from "@/types/lcq";

interface QuestionProps {
  questionKey: string;
  question: string;
  answer: boolean;
  explanation: string;
  onAnswerChange: (value: boolean) => void;
  onExplanationChange: (value: string) => void;
}

function DueDiligenceQuestion({
  questionKey,
  question,
  answer,
  explanation,
  onAnswerChange,
  onExplanationChange,
}: QuestionProps) {
  return (
    <div className="border-b pb-4 last:border-b-0">
      <div className="flex flex-col space-y-3">
        <p className="font-medium text-[#1c151d]">{question}</p>
        <RadioGroup
          value={answer ? "yes" : "no"}
          onValueChange={(value) => {
            onAnswerChange(value === "yes");
          }}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id={`${questionKey}-yes`} />
            <Label htmlFor={`${questionKey}-yes`}>Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id={`${questionKey}-no`} />
            <Label htmlFor={`${questionKey}-no`}>No</Label>
          </div>
        </RadioGroup>
        {answer === true && (
          <Textarea
            value={explanation}
            onChange={(e) => onExplanationChange(e.target.value)}
            placeholder="Please provide details (minimum 10 characters)..."
            className="min-h-[80px] mt-2 bg-white"
          />
        )}
      </div>
    </div>
  );
}

const QUESTIONS = [
  { key: "forProfitOwnership", question: "Do you presently have an ownership or management interest in any for-profit enterprise in which you, or any member of your immediate family (e.g. spouse, parents, children, siblings), take an active role?" },
  { key: "publicOffice", question: "Do you or does any member of your immediate family (spouse, domestic partner, child, parent) (a) hold public office (judicial, executive, or legislative), whether elected or appointed; or (b) work as an employee of any governmental or public body or agency?" },
  { key: "businessRelationships", question: "Have you had a business relationship with any of your clients during the past 10 years (separate from providing legal services to that client)?" },
  { key: "failedToFileTaxReturns", question: "Have you failed to file any required local, state or federal income tax returns for the preceding three years by their required due dates?" },
  { key: "failedToPayTaxes", question: "Have you failed to pay any required local, state, or federal income taxes for the preceding three years by their required due dates?" },
  { key: "taxAudit", question: "Do you have any tax years under audit or notices of impending audit?" },
  { key: "liens", question: "Do you have any liens, garnishments, wage deduction agreements or judgments in place?" },
  { key: "bankruptcy", question: "Have you, or has a business in which you directly or indirectly owned an ownership interest or which you controlled, or of which you were an officer, director, partner or manager, ever filed for bankruptcy or sought any form of protection from the bankruptcy court?" },
  { key: "disciplinaryProceedings", question: "Are you now, or have you been, a party to, or the subject of, any sort of professional disciplinary proceeding or investigation, including, but not limited to, one brought in or by a professional licensing organization, bar association or court?" },
  { key: "litigation", question: "Are you now, or have you been, a party (plaintiff or defendant) in any administrative proceeding, arbitration, or civil court action? (You may exclude routine, non-alcohol related or non-drug related motor vehicle offenses)" },
  { key: "malpracticeClaims", question: "Has anyone ever asserted against you, or against others, any claim based upon alleged legal malpractice, professional negligence, breach of fiduciary duty or any similar allegation, arising from legal work done in whole or in part of by you?" },
  { key: "falseStatementClaims", question: "Has a civil or criminal complaint ever been filed against you related to the practice of law, or which involved dishonesty, false statement, fraud or breach of fiduciary duty?" },
  { key: "potentialClaims", question: "Are you aware of any circumstances that may give rise to any claim against you, including but not limited to matters that have been reported to an insurance carrier?" },
  { key: "investigations", question: "To your knowledge, have you ever been investigated (except in connections with obtaining a professional license or a security clearance) by a government agency, including, without limitation, the FBI, local or state law enforcement agencies, the SEC, FCC, Department of Justice, Department of Defense, Department of State, IRS or any other regulatory agency?" },
  { key: "debarment", question: "Are you now, or have you ever been debarred, suspended, or otherwise limited from providing services to any federal, state, local, municipal or other governmental entity, agency or division?" },
] as const;

type QuestionKey = (typeof QUESTIONS)[number]["key"];

export default function DueDiligencePage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { user } = useAuthStore();
  const dueDiligence = useLCQStore((s) => s.dueDiligence);
  const updateDueDiligence = useLCQStore((s) => s.updateDueDiligence);
  const addBoardMembership = useLCQStore((s) => s.addBoardMembership);
  const deleteBoardMembership = useLCQStore((s) => s.deleteBoardMembership);
  const loadApplication = useLCQStore((s) => s.loadApplication);
  const applicationType = useLCQStore((s) => s.applicationType);

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (applicationId) {
      loadApplication(applicationId);
    }
  }, [user, applicationId, loadApplication, router]);

  const [boardDialogOpen, setBoardDialogOpen] = useState(false);
  const [newBoard, setNewBoard] = useState({
    organizationName: "",
    datesOfService: "",
    natureOfOrganization: "",
    anticipateContinuing: false,
    legalClaimsPending: false,
    hasDOCoverage: false,
    performedLegalServices: false,
    anticipatePerformingLegalServices: false,
    anticipateClientOfDentons: false,
    receiveCompensation: false,
    compensationDetails: "",
  });

  const handleQuestionChange = (key: QuestionKey, answer: boolean) => {
    updateDueDiligence({
      [key]: answer,
      [`${key}Details`]: answer === false ? "" : dueDiligence[`${key}Details` as keyof typeof dueDiligence],
    });
  };

  const handleExplanationChange = (key: QuestionKey, explanation: string) => {
    updateDueDiligence({
      [`${key}Details`]: explanation,
    });
  };

  const handleAddBoard = () => {
    if (newBoard.organizationName && newBoard.datesOfService) {
      addBoardMembership(newBoard);
      setNewBoard({
        organizationName: "",
        datesOfService: "",
        natureOfOrganization: "",
        anticipateContinuing: false,
        legalClaimsPending: false,
        hasDOCoverage: false,
        performedLegalServices: false,
        anticipatePerformingLegalServices: false,
        anticipateClientOfDentons: false,
        receiveCompensation: false,
        compensationDetails: "",
      });
      setBoardDialogOpen(false);
    }
  };

  const handleSubmit = async (): Promise<boolean> => {
    return true;
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">Due Diligence</h1>
        <p className="text-[#7c6b80] mt-2">
          Please answer the following questions honestly. If you answer &quot;Yes&quot; to any question, provide a detailed explanation.
        </p>
      </div>

      <Card className="border border-[#e5e0e7] shadow-sm">
        <CardContent className="p-8">
        <div className="space-y-6">
          {QUESTIONS.map(({ key, question }) => (
            <DueDiligenceQuestion
              key={key}
              questionKey={key}
              question={question}
              answer={dueDiligence[key as QuestionKey] as boolean}
              explanation={dueDiligence[`${key}Details` as keyof typeof dueDiligence] as string || ""}
              onAnswerChange={(value) => handleQuestionChange(key as QuestionKey, value)}
              onExplanationChange={(value) => handleExplanationChange(key as QuestionKey, value)}
            />
          ))}

          {/* Board Memberships Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2 text-[#1c151d]">Board Member/Officer/LLC Manager Positions</h3>
            <p className="text-sm text-[#7c6b80] mb-4">
              Do you currently hold or have held in the past 10 years any position as an officer, director, LLC manager or fiduciary of any corporation, foundation, partnership, association or other organization, including any not-for-profit entity?
            </p>
          </div>

          {dueDiligence.boardMemberships.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Board Memberships</h3>
                  <p className="text-sm text-gray-500">
                    Please provide details about each board position.
                  </p>
                </div>
                <Dialog open={boardDialogOpen} onOpenChange={setBoardDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Board
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Board Membership</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Organization Name *</Label>
                        <Input
                          value={newBoard.organizationName}
                          onChange={(e) =>
                            setNewBoard({ ...newBoard, organizationName: e.target.value })
                          }
                          placeholder="Organization name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dates of Service *</Label>
                        <Input
                          value={newBoard.datesOfService}
                          onChange={(e) =>
                            setNewBoard({ ...newBoard, datesOfService: e.target.value })
                          }
                          placeholder="e.g., Jan 2020 - Present"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nature of Organization *</Label>
                        <Input
                          value={newBoard.natureOfOrganization}
                          onChange={(e) =>
                            setNewBoard({ ...newBoard, natureOfOrganization: e.target.value })
                          }
                          placeholder="e.g., 501(c)(3) not for profit, for-profit corporation, etc."
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="anticipateContinuing"
                            checked={newBoard.anticipateContinuing}
                            onCheckedChange={(checked) =>
                              setNewBoard({ ...newBoard, anticipateContinuing: checked as boolean })
                            }
                          />
                          <Label htmlFor="anticipateContinuing">
                            Anticipate continuing this board membership upon joining Dentons
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="legalClaimsPending"
                            checked={newBoard.legalClaimsPending}
                            onCheckedChange={(checked) =>
                              setNewBoard({ ...newBoard, legalClaimsPending: checked as boolean })
                            }
                          />
                          <Label htmlFor="legalClaimsPending">
                            Legal claims pending against organization
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="hasDOCoverage"
                            checked={newBoard.hasDOCoverage}
                            onCheckedChange={(checked) =>
                              setNewBoard({ ...newBoard, hasDOCoverage: checked as boolean })
                            }
                          />
                          <Label htmlFor="hasDOCoverage">
                            Has D&O insurance coverage
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="performedLegalServices"
                            checked={newBoard.performedLegalServices}
                            onCheckedChange={(checked) =>
                              setNewBoard({ ...newBoard, performedLegalServices: checked as boolean })
                            }
                          />
                          <Label htmlFor="performedLegalServices">
                            Have performed legal services for this organization
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="willPerformAtDentons"
                            checked={newBoard.willPerformAtDentons}
                            onCheckedChange={(checked) =>
                              setNewBoard({ ...newBoard, willPerformAtDentons: checked as boolean })
                            }
                          />
                          <Label htmlFor="willPerformAtDentons">
                            Will provide legal services through Dentons
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="willBeDentonsClient"
                            checked={newBoard.willBeDentonsClient}
                            onCheckedChange={(checked) =>
                              setNewBoard({ ...newBoard, willBeDentonsClient: checked as boolean })
                            }
                          />
                          <Label htmlFor="willBeDentonsClient">
                            Organization will become a Dentons client
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="receiveCompensation"
                            checked={newBoard.receiveCompensation}
                            onCheckedChange={(checked) =>
                              setNewBoard({ ...newBoard, receiveCompensation: checked as boolean })
                            }
                          />
                          <Label htmlFor="receiveCompensation">
                            Will receive or anticipate any form of compensation (including stock options, reimbursements, etc.)
                          </Label>
                        </div>
                        {newBoard.receiveCompensation && (
                          <div className="space-y-2 mt-2">
                            <Label>Compensation Details</Label>
                            <Textarea
                              value={newBoard.compensationDetails}
                              onChange={(e) =>
                                setNewBoard({ ...newBoard, compensationDetails: e.target.value })
                              }
                              placeholder="Describe the compensation..."
                              rows={2}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleAddBoard}>Add Board</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {dueDiligence.boardMemberships.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p>No board memberships added yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {dueDiligence.boardMemberships.map((board) => (
                    <div
                      key={board.id}
                      className="flex items-start justify-between p-3 bg-white rounded border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{board.organizationName}</p>
                        </div>
                        <p className="text-xs text-[#7c6b80] mt-1">
                          {board.datesOfService}
                        </p>
                        <p className="text-xs text-[#7c6b80] mt-1">
                          {board.natureOfOrganization}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {board.anticipateContinuing && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              Continuing
                            </span>
                          )}
                          {board.hasDOCoverage && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              D&O Coverage
                            </span>
                          )}
                          {board.receiveCompensation && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                              Compensated
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteBoardMembership(board.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Work Authorization</h3>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="font-medium text-gray-800 mb-3">
                  Are you legally eligible to work in the United States?
                </p>
                <RadioGroup
                  value={dueDiligence.legallyEligibleToWork ? "yes" : "no"}
                  onValueChange={(value) => {
                    updateDueDiligence({
                      legallyEligibleToWork: value === "yes",
                    });
                  }}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="eligible-yes" />
                    <Label htmlFor="eligible-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="eligible-no" />
                    <Label htmlFor="eligible-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="pb-4">
                <p className="font-medium text-gray-800 mb-3">
                  Do you now or will you require visa sponsorship to work in the United States?
                </p>
                <RadioGroup
                  value={dueDiligence.requiresVisaSponsorship ? "yes" : "no"}
                  onValueChange={(value) => {
                    updateDueDiligence({
                      requiresVisaSponsorship: value === "yes",
                    });
                  }}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="visa-yes" />
                    <Label htmlFor="visa-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="visa-no" />
                    <Label htmlFor="visa-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        </div>

        <WizardNavigation
          applicationId={applicationId}
          backHref={getPreviousStep("/application/due-diligence", applicationType) || ""}
          nextHref={getNextStep("/application/due-diligence", applicationType) || ""}
          currentStep="/application/due-diligence"
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
    </div>
  );
}
