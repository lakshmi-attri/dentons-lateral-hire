"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { WizardNavigation } from "@/components/application/wizard-navigation";
import { useLCQStore } from "@/stores/lcq-store";
import { useAuthStore } from "@/stores/auth-store";
import { getNextStep, getPreviousStep } from "@/lib/navigation-helper";

export default function ClientsPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { user } = useAuthStore();
  const portableClients = useLCQStore((s) => s.portableClients);
  const addPortableClient = useLCQStore((s) => s.addPortableClient);
  const deletePortableClient = useLCQStore((s) => s.deletePortableClient);
  const addMatterToClient = useLCQStore((s) => s.addMatterToClient);
  const deleteMatter = useLCQStore((s) => s.deleteMatter);
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

  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [matterDialogOpen, setMatterDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [expandedClients, setExpandedClients] = useState<string[]>([]);

  const [newClient, setNewClient] = useState({
    clientName: "",
    keyContactName: "",
    keyContactTitle: "",
    keyContactEmail: "",
    affiliatesSubsidiaries: "",
    yearsRepresented: 1,
    portableWithin30Days: true,
    numberOfOpenMatters: 1,
    workDescription: "",
    staffingDescription: "",
    billRateForClient: 0,
    financialHistory: {
      billings: { year2022: 0, year2023: 0, year2024: 0, year2025YTD: 0 },
      collections: { year2022: 0, year2023: 0, year2024: 0, year2025YTD: 0 },
    },
    anticipatedCollections: {
      lowEstimate: 0,
      baseEstimate: 0,
      highEstimate: 0,
    },
  });

  const [newMatter, setNewMatter] = useState({
    matterName: "",
    matterDescription: "",
    adverseParties: "",
    howAdverseInvolved: "",
  });

  const toggleClient = (clientId: string) => {
    setExpandedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleAddClient = () => {
    if (newClient.clientName && newClient.keyContactName) {
      addPortableClient(newClient);
      setNewClient({
        clientName: "",
        keyContactName: "",
        keyContactTitle: "",
        keyContactEmail: "",
        affiliatesSubsidiaries: "",
        yearsRepresented: 1,
        portableWithin30Days: true,
        numberOfOpenMatters: 1,
        workDescription: "",
        staffingDescription: "",
        billRateForClient: 0,
        financialHistory: {
          billings: { year2022: 0, year2023: 0, year2024: 0, year2025YTD: 0 },
          collections: { year2022: 0, year2023: 0, year2024: 0, year2025YTD: 0 },
        },
        anticipatedCollections: {
          lowEstimate: 0,
          baseEstimate: 0,
          highEstimate: 0,
        },
      });
      setClientDialogOpen(false);
    }
  };

  const handleAddMatter = () => {
    if (selectedClientId && newMatter.matterName && newMatter.matterDescription) {
      addMatterToClient(selectedClientId, newMatter);
      setNewMatter({
        matterName: "",
        matterDescription: "",
        adverseParties: "",
        howAdverseInvolved: "",
      });
      setMatterDialogOpen(false);
    }
  };

  const openMatterDialog = (clientId: string) => {
    setSelectedClientId(clientId);
    setMatterDialogOpen(true);
  };

  const handleSubmit = async (): Promise<boolean> => {
    return true;
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">Portable Clients</h1>
        <p className="text-[#7c6b80] mt-2">
          List the clients you expect to bring to Dentons, including matter details and financial projections.
        </p>
      </div>

      <Card className="border border-[#e5e0e7] shadow-sm">
        <CardContent className="p-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            {portableClients.length} client(s) added
          </p>
          <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Portable Client</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client Name *</Label>
                    <Input
                      value={newClient.clientName}
                      onChange={(e) =>
                        setNewClient({ ...newClient, clientName: e.target.value })
                      }
                      placeholder="Client name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Key Contact Name *</Label>
                    <Input
                      value={newClient.keyContactName}
                      onChange={(e) =>
                        setNewClient({ ...newClient, keyContactName: e.target.value })
                      }
                      placeholder="Contact name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Key Contact Title</Label>
                    <Input
                      value={newClient.keyContactTitle}
                      onChange={(e) =>
                        setNewClient({ ...newClient, keyContactTitle: e.target.value })
                      }
                      placeholder="Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Key Contact Email</Label>
                    <Input
                      type="email"
                      value={newClient.keyContactEmail}
                      onChange={(e) =>
                        setNewClient({ ...newClient, keyContactEmail: e.target.value })
                      }
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Years Represented *</Label>
                    <Input
                      type="number"
                      min={1}
                      value={newClient.yearsRepresented}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          yearsRepresented: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bill Rate for Client ($)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={newClient.billRateForClient}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          billRateForClient: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="portable30"
                    checked={newClient.portableWithin30Days}
                    onCheckedChange={(checked) =>
                      setNewClient({
                        ...newClient,
                        portableWithin30Days: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="portable30">Portable within 30 days</Label>
                </div>
                <div className="space-y-2">
                  <Label>Work Description *</Label>
                  <Textarea
                    value={newClient.workDescription}
                    onChange={(e) =>
                      setNewClient({ ...newClient, workDescription: e.target.value })
                    }
                    placeholder="Describe the type of work performed..."
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Staffing Description *</Label>
                  <Textarea
                    value={newClient.staffingDescription}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        staffingDescription: e.target.value,
                      })
                    }
                    placeholder="Describe how this client is typically staffed..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddClient}>Add Client</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {portableClients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No portable clients added yet.</p>
            <p className="text-sm mt-2">Click &quot;Add Client&quot; to add your first client.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {portableClients.map((client) => (
              <Collapsible
                key={client.id}
                open={expandedClients.includes(client.id)}
                onOpenChange={() => toggleClient(client.id)}
              >
                <div className="border rounded-lg">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        {expandedClients.includes(client.id) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                        <div>
                          <h4 className="font-semibold">{client.clientName}</h4>
                          <p className="text-sm text-gray-500">
                            {client.matters.length} matter(s) • {client.yearsRepresented}{" "}
                            year(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openMatterDialog(client.id);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Matter
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePortableClient(client.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 border-t">
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Key Contact:</span>{" "}
                            {client.keyContactName}
                          </div>
                          <div>
                            <span className="text-gray-500">Portable in 30 days:</span>{" "}
                            {client.portableWithin30Days ? "Yes" : "No"}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Matters</h5>
                          {client.matters.length === 0 ? (
                            <p className="text-sm text-gray-500">
                              No matters added yet. Click &quot;Add Matter&quot; above.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {client.matters.map((matter) => (
                                <div
                                  key={matter.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                                >
                                  <div>
                                    <p className="font-medium">{matter.matterName}</p>
                                    <p className="text-sm text-gray-500">
                                      {matter.matterDescription.substring(0, 100)}...
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteMatter(client.id, matter.id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}

        <Dialog open={matterDialogOpen} onOpenChange={setMatterDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Matter</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Matter Name *</Label>
                <Input
                  value={newMatter.matterName}
                  onChange={(e) =>
                    setNewMatter({ ...newMatter, matterName: e.target.value })
                  }
                  placeholder="Matter name"
                />
              </div>
              <div className="space-y-2">
                <Label>Matter Description *</Label>
                <Textarea
                  value={newMatter.matterDescription}
                  onChange={(e) =>
                    setNewMatter({ ...newMatter, matterDescription: e.target.value })
                  }
                  placeholder="Describe the matter..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Adverse Parties *</Label>
                <Input
                  value={newMatter.adverseParties}
                  onChange={(e) =>
                    setNewMatter({ ...newMatter, adverseParties: e.target.value })
                  }
                  placeholder="List adverse parties"
                />
              </div>
              <div className="space-y-2">
                <Label>How Adverse Parties are Involved *</Label>
                <Textarea
                  value={newMatter.howAdverseInvolved}
                  onChange={(e) =>
                    setNewMatter({ ...newMatter, howAdverseInvolved: e.target.value })
                  }
                  placeholder="Describe involvement..."
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddMatter}>Add Matter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <WizardNavigation
          applicationId={applicationId}
          backHref={getPreviousStep("/application/clients", applicationType) || ""}
          nextHref={getNextStep("/application/clients", applicationType) || ""}
          currentStep="/application/clients"
          onSubmit={handleSubmit}
        />
        </CardContent>
      </Card>
    </div>
  );
}
