"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, User, Briefcase, DollarSign, AlertTriangle, FileText, List, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/auth-store";
import { useLCQStore } from "@/stores/lcq-store";
import { storage } from "@/lib/storage";
import type { Application } from "@/types/application";

export default function AdminApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;
  const { isAdmin } = useAuthStore();
  const [application, setApplication] = useState<Application | null>(null);
  const [newNote, setNewNote] = useState("");
  const [internalNotes, setInternalNotes] = useState<Array<{ author: string; date: string; note: string }>>([
    { author: "Jennifer Adams", date: "Dec 14, 2024", note: "Excellent first impression. Strong M&A background aligns well with our SF office needs. Recommend advancing to partner interview." },
    { author: "David Park", date: "Dec 12, 2024", note: "Verified portable revenue figures with reference. Client relationships appear very strong and likely to transition." },
  ]);
  const [applicationStatus, setApplicationStatus] = useState("submitted");
  const [assignedReviewer, setAssignedReviewer] = useState("jennifer-adams");

  // Load application data into LCQ store for access
  const loadApplication = useLCQStore((s) => s.loadApplication);
  const contactInfo = useLCQStore((s) => s.contactInfo);
  const education = useLCQStore((s) => s.education);
  const workHistory = useLCQStore((s) => s.workHistory);
  const financials = useLCQStore((s) => s.financials);
  const portableClients = useLCQStore((s) => s.portableClients);
  const conflicts = useLCQStore((s) => s.conflicts);
  const applicationType = useLCQStore((s) => s.applicationType);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/applications');
      return;
    }

    const applications = storage.get('applications') || [];
    const app = applications.find((a: Application) => a.id === applicationId);
    
    if (app) {
      setApplication(app);
      loadApplication(applicationId);
      setApplicationStatus(app.status);
    }
  }, [applicationId, isAdmin, router, loadApplication]);

  if (!application) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-[#7c6b80]">Loading application...</div>
      </div>
    );
  }

  const candidateName = application.data.contactInfo?.legalFirstName && application.data.contactInfo?.legalLastName
    ? `${application.data.contactInfo.legalFirstName} ${application.data.contactInfo.legalLastName}`
    : 'Draft Application';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateTotalPortableRevenue = () => {
    return portableClients.reduce((total, client) => {
      return total + client.anticipatedCollections.baseEstimate;
    }, 0) || financials.anticipatedCollections.baseEstimate || 2450000;
  };

  const calculateYearsAtCurrentFirm = () => {
    if (!workHistory.currentPosition.startDate) return 0;
    const start = new Date(workHistory.currentPosition.startDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
  };

  const calculateTotalExperience = () => {
    const currentYears = calculateYearsAtCurrentFirm();
    const priorYears = workHistory.priorPositions.reduce((total, position) => {
      if (position.startDate && position.endDate) {
        const start = new Date(position.startDate);
        const end = new Date(position.endDate);
        const years = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365));
        return total + years;
      }
      return total;
    }, 0);
    return currentYears + priorYears || 14;
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        author: "Current User",
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        note: newNote.trim(),
      };
      setInternalNotes([note, ...internalNotes]);
      setNewNote("");
    }
  };

  const hasConflicts = conflicts.adverseToDentons.length > 0 || conflicts.priorClients.length > 0 || conflicts.prospectiveClients.length > 0;

  return (
    <div className="min-h-screen bg-[#f7f6f8]">
      {/* Purple Header Bar */}
      <div className="bg-primary text-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 bg-white/20 border-2 border-white/30">
              <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                {getInitials(candidateName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {candidateName}
              </h1>
              <p className="text-white/90 text-sm mt-1">
                {applicationType === 'individual' ? 'Corporate / M&A' : 'Group Practice'} Partner Candidate
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Advance to Interview
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/admin/applications')}
              className="text-white hover:bg-white/10 h-10 w-10 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Candidate Information Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border border-[#e5e0e7]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1c151d]">Personal Information</h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-1">Full Name</p>
                    <p className="text-sm text-[#1c151d]">{candidateName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-1">Email</p>
                    <p className="text-sm text-[#1c151d]">{contactInfo.personalEmail || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-1">Phone</p>
                    <p className="text-sm text-[#1c151d]">
                      {contactInfo.personalPhone || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-1">Location</p>
                    <p className="text-sm text-[#1c151d]">
                      {contactInfo.city && contactInfo.state 
                        ? `${contactInfo.city}, ${contactInfo.state}`
                        : contactInfo.city || contactInfo.state || 'Not provided'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Background */}
            <Card className="border border-[#e5e0e7]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1c151d]">Professional Background</h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-1">Current Firm</p>
                    <p className="text-sm text-[#1c151d]">{workHistory.currentPosition.firmName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-1">Current Title</p>
                    <p className="text-sm text-[#1c151d]">{workHistory.currentPosition.title || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-1">Years at Current Firm</p>
                    <p className="text-sm text-[#1c151d]">{calculateYearsAtCurrentFirm()} years</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-1">Total Experience</p>
                    <p className="text-sm text-[#1c151d]">{calculateTotalExperience()} years</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-1">Practice Areas</p>
                    <p className="text-sm text-[#1c151d]">
                      {applicationType === 'individual' 
                        ? 'Mergers & Acquisitions, Private Equity, Corporate Governance, Securities, Venture Capital'
                        : 'Group Practice'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business & Portable Clients */}
            <Card className="border border-[#e5e0e7]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1c151d]">Business & Portable Clients</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-2">Total Portable Revenue</p>
                    <p className="text-3xl font-bold text-[#1c151d]">
                      {formatCurrency(calculateTotalPortableRevenue())}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-1">Key Clients</p>
                    <p className="text-sm text-[#1c151d]">{portableClients.length} clients</p>
                  </div>
                  {portableClients.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-2">Top Clients</p>
                      <div className="space-y-1">
                        {portableClients.slice(0, 4).map((client, index) => (
                          <p key={client.id} className="text-sm text-[#1c151d]">
                            {client.clientName} ({formatCurrency(client.anticipatedCollections.baseEstimate)}){index < Math.min(portableClients.length, 4) - 1 ? ' •' : ''}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Conflicts & Adversity */}
            <Card className="border border-[#e5e0e7]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1c151d]">Conflicts & Adversity</h2>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-1">Conflict Status</p>
                  <div className="flex items-center gap-2">
                    {!hasConflicts ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <p className="text-sm text-[#1c151d]">No conflicts identified</p>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-primary" />
                        <p className="text-sm text-[#1c151d]">
                          {conflicts.adverseToDentons.length + conflicts.priorClients.length + conflicts.prospectiveClients.length} conflict{conflicts.adverseToDentons.length + conflicts.priorClients.length + conflicts.prospectiveClients.length > 1 ? 's' : ''} identified
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Admin Workflow */}
          <div className="lg:col-span-1 space-y-6">
            {/* Internal Notes */}
            <Card className="border border-[#e5e0e7]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1c151d]">Internal Notes</h2>
                </div>
                <div className="space-y-4 mb-4">
                  {internalNotes.map((note, index) => (
                    <div key={index} className="pb-4 border-b border-[#e5e0e7] last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-[#1c151d]">{note.author}</p>
                        <p className="text-xs text-[#7c6b80]">{note.date}</p>
                      </div>
                      <p className="text-sm text-[#7c6b80]">{note.note}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddNote();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleAddNote} className="bg-primary text-white hover:bg-primary/90">
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status & Assignment */}
            <Card className="border border-[#e5e0e7]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <List className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1c151d]">Status & Assignment</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-2">Application Status</p>
                    <Select value={applicationStatus} onValueChange={setApplicationStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="additional_info_required">Info Required</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#7c6b80] uppercase mb-2">Assigned Reviewer</p>
                    <Select value={assignedReviewer} onValueChange={setAssignedReviewer}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jennifer-adams">Jennifer Adams (Managing Partner)</SelectItem>
                        <SelectItem value="david-park">David Park (Senior Partner)</SelectItem>
                        <SelectItem value="sarah-johnson">Sarah Johnson (Partner)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
