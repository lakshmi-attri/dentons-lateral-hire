"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { PRACTICE_AREAS, US_STATES } from "@/types/lcq";

export default function GroupOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { user } = useAuthStore();
  const groupOverview = useLCQStore((s) => s.groupOverview);
  const updateGroupOverview = useLCQStore((s) => s.updateGroupOverview);
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

  const [newLocation, setNewLocation] = useState("");
  const [newPracticeArea, setNewPracticeArea] = useState("");

  const addLocation = () => {
    if (newLocation && !groupOverview.currentOfficeLocations.includes(newLocation)) {
      updateGroupOverview({
        currentOfficeLocations: [...groupOverview.currentOfficeLocations, newLocation],
      });
      setNewLocation("");
    }
  };

  const removeLocation = (location: string) => {
    updateGroupOverview({
      currentOfficeLocations: groupOverview.currentOfficeLocations.filter((l) => l !== location),
    });
  };

  const addPracticeArea = () => {
    if (newPracticeArea && !groupOverview.primaryPracticeAreas.includes(newPracticeArea)) {
      updateGroupOverview({
        primaryPracticeAreas: [...groupOverview.primaryPracticeAreas, newPracticeArea],
      });
      setNewPracticeArea("");
    }
  };

  const removePracticeArea = (area: string) => {
    updateGroupOverview({
      primaryPracticeAreas: groupOverview.primaryPracticeAreas.filter((a) => a !== area),
    });
  };

  const handleSubmit = async (): Promise<boolean> => {
    return true;
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">Group Overview</h1>
        <p className="text-[#7c6b80] mt-2">
          Provide information about your firm/practice group and the team joining Dentons.
        </p>
      </div>

      <Card className="border border-[#e5e0e7] shadow-sm">
        <CardContent className="p-8">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Firm/Practice Name *</Label>
              <Input
                value={groupOverview.firmName}
                onChange={(e) => updateGroupOverview({ firmName: e.target.value })}
                placeholder="Enter firm or practice group name"
              />
            </div>
            <div className="space-y-2">
              <Label>Firm Structure *</Label>
              <Select
                value={groupOverview.firmStructure}
                onValueChange={(value) => updateGroupOverview({ firmStructure: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llp">LLP</SelectItem>
                  <SelectItem value="pc">Professional Corporation (PC)</SelectItem>
                  <SelectItem value="pllc">PLLC</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="practice_group">Practice Group within Larger Firm</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Year Established</Label>
            <Input
              type="number"
              min="1800"
              max="2025"
              value={groupOverview.yearEstablished || ""}
              onChange={(e) =>
                updateGroupOverview({ yearEstablished: parseInt(e.target.value) || null })
              }
              placeholder="e.g., 1995"
              className="max-w-[200px]"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Team Size</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Total Partners in Firm *</Label>
                <Input
                  type="number"
                  min="1"
                  value={groupOverview.totalPartnersInFirm}
                  onChange={(e) =>
                    updateGroupOverview({ totalPartnersInFirm: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Partners Joining Dentons *</Label>
                <Input
                  type="number"
                  min="2"
                  value={groupOverview.partnersJoiningDentons}
                  onChange={(e) =>
                    updateGroupOverview({ partnersJoiningDentons: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div></div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-4">
              <div className="space-y-2">
                <Label>Total Associates</Label>
                <Input
                  type="number"
                  min="0"
                  value={groupOverview.totalAssociates}
                  onChange={(e) =>
                    updateGroupOverview({ totalAssociates: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Associates Joining</Label>
                <Input
                  type="number"
                  min="0"
                  value={groupOverview.associatesJoining}
                  onChange={(e) =>
                    updateGroupOverview({ associatesJoining: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div></div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-4">
              <div className="space-y-2">
                <Label>Total Staff</Label>
                <Input
                  type="number"
                  min="0"
                  value={groupOverview.totalStaff}
                  onChange={(e) =>
                    updateGroupOverview({ totalStaff: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Staff Joining</Label>
                <Input
                  type="number"
                  min="0"
                  value={groupOverview.staffJoining}
                  onChange={(e) =>
                    updateGroupOverview({ staffJoining: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div></div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Office Locations *</h3>
            <div className="flex gap-2 mb-4">
              <Select value={newLocation} onValueChange={setNewLocation}>
                <SelectTrigger className="max-w-[300px]">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addLocation} disabled={!newLocation}>
                Add Location
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {groupOverview.currentOfficeLocations.map((location) => (
                <Badge key={location} variant="secondary" className="text-sm py-1 px-3">
                  {location}
                  <button
                    type="button"
                    onClick={() => removeLocation(location)}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {groupOverview.currentOfficeLocations.length === 0 && (
                <p className="text-sm text-gray-500">No locations added yet.</p>
              )}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Primary Practice Areas *</h3>
            <div className="flex gap-2 mb-4">
              <Select value={newPracticeArea} onValueChange={setNewPracticeArea}>
                <SelectTrigger className="max-w-[300px]">
                  <SelectValue placeholder="Select a practice area" />
                </SelectTrigger>
                <SelectContent>
                  {PRACTICE_AREAS.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addPracticeArea} disabled={!newPracticeArea}>
                Add Practice Area
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {groupOverview.primaryPracticeAreas.map((area) => (
                <Badge key={area} variant="secondary" className="text-sm py-1 px-3">
                  {area}
                  <button
                    type="button"
                    onClick={() => removePracticeArea(area)}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {groupOverview.primaryPracticeAreas.length === 0 && (
                <p className="text-sm text-gray-500">No practice areas added yet.</p>
              )}
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="space-y-2">
              <Label>Reason for Transition to Dentons *</Label>
              <Textarea
                value={groupOverview.reasonForTransition}
                onChange={(e) => updateGroupOverview({ reasonForTransition: e.target.value })}
                placeholder="Explain why your group is considering joining Dentons (minimum 100 characters)..."
                className="min-h-[120px]"
              />
              <p className="text-xs text-gray-500">
                {groupOverview.reasonForTransition.length}/100 characters minimum
              </p>
            </div>

            <div className="space-y-2">
              <Label>Integration Timeline *</Label>
              <Textarea
                value={groupOverview.integrationTimeline}
                onChange={(e) => updateGroupOverview({ integrationTimeline: e.target.value })}
                placeholder="Describe your expected timeline for integration (minimum 50 characters)..."
                className="min-h-[80px]"
              />
              <p className="text-xs text-gray-500">
                {groupOverview.integrationTimeline.length}/50 characters minimum
              </p>
            </div>
          </div>
        </div>

        <WizardNavigation
          applicationId={applicationId}
          backHref={getPreviousStep("/application/group-overview", applicationType) || ""}
          nextHref={getNextStep("/application/group-overview", applicationType) || ""}
          currentStep="/application/group-overview"
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
    </div>
  );
}
