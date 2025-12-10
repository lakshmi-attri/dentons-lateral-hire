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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { WizardNavigation } from "@/components/application/wizard-navigation";
import { useLCQStore } from "@/stores/lcq-store";
import { getNextStep, getPreviousStep } from "@/lib/navigation-helper";
import { useAuthStore } from "@/stores/auth-store";

export default function ConflictsPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { user } = useAuthStore();
  const conflicts = useLCQStore((s) => s.conflicts);
  const addClientAdverseToDentons = useLCQStore((s) => s.addClientAdverseToDentons);
  const deleteClientAdverseToDentons = useLCQStore((s) => s.deleteClientAdverseToDentons);
  const addPriorClient = useLCQStore((s) => s.addPriorClient);
  const deletePriorClient = useLCQStore((s) => s.deletePriorClient);
  const addProspectiveClient = useLCQStore((s) => s.addProspectiveClient);
  const deleteProspectiveClient = useLCQStore((s) => s.deleteProspectiveClient);
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
  const updateProBonoWork = useLCQStore((s) => s.updateProBonoWork);

  const [adverseDialogOpen, setAdverseDialogOpen] = useState(false);
  const [priorDialogOpen, setPriorDialogOpen] = useState(false);
  const [prospectiveDialogOpen, setProspectiveDialogOpen] = useState(false);

  const [newAdverse, setNewAdverse] = useState({
    dentonsRepresentedEntity: "",
    matterDescription: "",
    datesOfInvolvement: "",
    yourRole: "",
  });

  const [newPrior, setNewPrior] = useState({
    clientName: "",
    natureOfWork: "",
  });

  const [newProspective, setNewProspective] = useState({
    clientName: "",
    natureOfOpportunity: "",
    adverseEntities: "",
  });

  const handleAddAdverse = () => {
    if (newAdverse.dentonsRepresentedEntity && newAdverse.matterDescription) {
      addClientAdverseToDentons(newAdverse);
      setNewAdverse({
        dentonsRepresentedEntity: "",
        matterDescription: "",
        datesOfInvolvement: "",
        yourRole: "",
      });
      setAdverseDialogOpen(false);
    }
  };

  const handleAddPrior = () => {
    if (newPrior.clientName && newPrior.natureOfWork) {
      addPriorClient(newPrior);
      setNewPrior({
        clientName: "",
        natureOfWork: "",
      });
      setPriorDialogOpen(false);
    }
  };

  const handleAddProspective = () => {
    if (newProspective.clientName && newProspective.natureOfOpportunity) {
      addProspectiveClient(newProspective);
      setNewProspective({
        clientName: "",
        natureOfOpportunity: "",
        adverseEntities: "",
      });
      setProspectiveDialogOpen(false);
    }
  };


  const handleSubmit = async (): Promise<boolean> => {
    return true;
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">Conflicts Information</h1>
        <p className="text-[#7c6b80] mt-2">
          Provide information about potential conflicts of interest, including adverse matters, prior clients, prospective clients, and pro bono work.
        </p>
      </div>

      <Card className="border border-[#e5e0e7] shadow-sm">
        <CardContent className="p-8">
        <Tabs defaultValue="adverse" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="adverse">
              Adverse to Dentons ({conflicts.adverseToDentons.length})
            </TabsTrigger>
            <TabsTrigger value="prior">
              Prior Clients ({conflicts.priorClients.length})
            </TabsTrigger>
            <TabsTrigger value="prospective">
              Prospective ({conflicts.prospectiveClients.length})
            </TabsTrigger>
            <TabsTrigger value="probono">
              Pro Bono
            </TabsTrigger>
          </TabsList>

          <TabsContent value="adverse">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Clients Adverse to Dentons</h3>
                  <p className="text-sm text-gray-500">
                    List any matters where you represented clients adverse to Dentons or its clients.
                  </p>
                </div>
                <Dialog open={adverseDialogOpen} onOpenChange={setAdverseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Adverse Client Entry</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Dentons Client/Entity *</Label>
                        <Input
                          value={newAdverse.dentonsRepresentedEntity}
                          onChange={(e) =>
                            setNewAdverse({ ...newAdverse, dentonsRepresentedEntity: e.target.value })
                          }
                          placeholder="Name of Dentons client or entity"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Matter Description *</Label>
                        <Textarea
                          value={newAdverse.matterDescription}
                          onChange={(e) =>
                            setNewAdverse({ ...newAdverse, matterDescription: e.target.value })
                          }
                          placeholder="Describe the matter..."
                          className="min-h-[80px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dates of Involvement *</Label>
                        <Input
                          value={newAdverse.datesOfInvolvement}
                          onChange={(e) =>
                            setNewAdverse({ ...newAdverse, datesOfInvolvement: e.target.value })
                          }
                          placeholder="e.g., Jan 2022 - Dec 2023"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Your Role *</Label>
                        <Textarea
                          value={newAdverse.yourRole}
                          onChange={(e) =>
                            setNewAdverse({ ...newAdverse, yourRole: e.target.value })
                          }
                          placeholder="Describe your role in the matter..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleAddAdverse}>Add Entry</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {conflicts.adverseToDentons.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border rounded-lg">
                  <p>No entries added yet.</p>
                  <p className="text-sm mt-1">Click &quot;Add Entry&quot; if you have any adverse matters to report.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conflicts.adverseToDentons.map((entry) => (
                    <div key={entry.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{entry.dentonsRepresentedEntity}</p>
                        <p className="text-sm text-gray-600 mt-1">{entry.matterDescription}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Dates: {entry.datesOfInvolvement} | Role: {entry.yourRole}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteClientAdverseToDentons(entry.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="prior">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Prior Clients</h3>
                  <p className="text-sm text-gray-500">
                    List significant prior clients you will not be bringing to Dentons.
                  </p>
                </div>
                <Dialog open={priorDialogOpen} onOpenChange={setPriorDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Prior Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Prior Client</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Client Name *</Label>
                        <Input
                          value={newPrior.clientName}
                          onChange={(e) =>
                            setNewPrior({ ...newPrior, clientName: e.target.value })
                          }
                          placeholder="Client name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nature of Work *</Label>
                        <Textarea
                          value={newPrior.natureOfWork}
                          onChange={(e) =>
                            setNewPrior({ ...newPrior, natureOfWork: e.target.value })
                          }
                          placeholder="Describe the nature of work performed..."
                          className="min-h-[80px]"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="confidentialInfo">
                          Had material confidential information about this client
                        </Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleAddPrior}>Add Client</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {conflicts.priorClients.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border rounded-lg">
                  <p>No prior clients added yet.</p>
                  <p className="text-sm mt-1">Click &quot;Add Prior Client&quot; to add entries.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conflicts.priorClients.map((client) => (
                    <div key={client.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{client.clientName}</p>
                        <p className="text-sm text-gray-600 mt-1">{client.natureOfWork}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePriorClient(client.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="prospective">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Prospective Clients</h3>
                  <p className="text-sm text-gray-500">
                    List prospective clients you are actively pursuing.
                  </p>
                </div>
                <Dialog open={prospectiveDialogOpen} onOpenChange={setProspectiveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Prospective Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add Prospective Client</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Client Name *</Label>
                        <Input
                          value={newProspective.clientName}
                          onChange={(e) =>
                            setNewProspective({ ...newProspective, clientName: e.target.value })
                          }
                          placeholder="Prospective client name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nature of Opportunity *</Label>
                        <Textarea
                          value={newProspective.natureOfOpportunity}
                          onChange={(e) =>
                            setNewProspective({ ...newProspective, natureOfOpportunity: e.target.value })
                          }
                          placeholder="Describe the opportunity..."
                          className="min-h-[80px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Known Adverse Entities</Label>
                        <Textarea
                          value={newProspective.adverseEntities}
                          onChange={(e) =>
                            setNewProspective({ ...newProspective, adverseEntities: e.target.value })
                          }
                          placeholder="List any known adverse entities..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleAddProspective}>Add Client</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {conflicts.prospectiveClients.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border rounded-lg">
                  <p>No prospective clients added yet.</p>
                  <p className="text-sm mt-1">Click &quot;Add Prospective Client&quot; to add entries.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conflicts.prospectiveClients.map((client) => (
                    <div key={client.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{client.clientName}</p>
                        <p className="text-sm text-gray-600 mt-1">{client.natureOfOpportunity}</p>
                        {client.adverseEntities && (
                          <p className="text-xs text-gray-500 mt-1">
                            Adverse: {client.adverseEntities}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProspectiveClient(client.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="probono">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Pro Bono Adversities</h3>
                <p className="text-sm text-[#7c6b80] mb-4">
                  Describe your pro bono efforts over the last three years, including entity name, nature of the work, any adverse parties, and whether the work is current and/or portable. If the work is ongoing and you anticipate porting to Dentons, please also include in portable clients section.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasProBonoWork"
                    checked={conflicts.proBonoWork.hasProBonoWork}
                    onCheckedChange={(checked) =>
                      updateProBonoWork({ hasProBonoWork: checked as boolean })
                    }
                  />
                  <Label htmlFor="hasProBonoWork">I have pro bono work to report</Label>
                </div>

                {conflicts.proBonoWork.hasProBonoWork && (
                  <div className="space-y-2">
                    <Label>Pro Bono Work Description *</Label>
                    <Textarea
                      value={conflicts.proBonoWork.description}
                      onChange={(e) =>
                        updateProBonoWork({ description: e.target.value })
                      }
                      placeholder="Describe your pro bono efforts, including entity names, nature of work, adverse parties, and whether work is current/portable (minimum 25 characters)"
                      className="min-h-[150px]"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <WizardNavigation
          applicationId={applicationId}
          backHref={getPreviousStep("/application/conflicts", applicationType) || ""}
          nextHref={getNextStep("/application/conflicts", applicationType) || ""}
          currentStep="/application/conflicts"
          onSubmit={handleSubmit}
        />
        </CardContent>
      </Card>
    </div>
  );
}
