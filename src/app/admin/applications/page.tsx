"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Download, Eye, Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/stores/auth-store";
import { useApplicationsListStore } from "@/stores/applications-list-store";
import { Progress } from "@/components/ui/progress";
import type { ApplicationStatus } from "@/types/application";

type DisplayStatus = 'in_progress' | 'submitted' | 'under_review';

const getDisplayStatus = (status: ApplicationStatus): DisplayStatus => {
  if (status === 'draft' || status === 'additional_info_required') {
    return 'in_progress';
  }
  if (status === 'submitted') {
    return 'submitted';
  }
  if (status === 'under_review' || status === 'approved' || status === 'rejected' || status === 'withdrawn') {
    return 'under_review';
  }
  return 'in_progress'; // default fallback
};

const statusConfig: Record<DisplayStatus, { label: string; color: string }> = {
  in_progress: { label: "In Progress", color: "bg-gray-100 text-gray-800" },
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800" },
  under_review: { label: "Under Review", color: "bg-yellow-100 text-yellow-800" },
};

export default function AdminApplicationsPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuthStore();
  const { applications, loading, loadAllApplications } = useApplicationsListStore();
  const [statusFilter, setStatusFilter] = useState<DisplayStatus | 'all'>('all');
  const [practiceFilter, setPracticeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }

    loadAllApplications();
  }, [user, isAdmin, loadAllApplications, router]);

  const filteredApplications = applications.filter(app => {
    const displayStatus = getDisplayStatus(app.status);
    const matchesStatus = statusFilter === 'all' || displayStatus === statusFilter;
    const matchesSearch = searchQuery === '' || 
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedApplications = [...filteredApplications].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-[#7c6b80]">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="max-w-full w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">
              Applications
            </h1>
            <p className="text-[#7c6b80] mt-1">
              Manage all partner candidate applications
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-6 bg-white rounded-lg border border-[#e5e0e7] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7c6b80]" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 border-[#e5e0e7]"
              />
            </div>
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as DisplayStatus | 'all')}
          >
            <SelectTrigger className="w-[180px] h-10">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
            </SelectContent>
          </Select>
          <Select value={practiceFilter} onValueChange={setPracticeFilter}>
            <SelectTrigger className="w-[200px] h-10">
              <SelectValue placeholder="All Practice Groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Practice Groups</SelectItem>
              <SelectItem value="corporate">Corporate / M&A</SelectItem>
              <SelectItem value="litigation">Litigation</SelectItem>
              <SelectItem value="ip">IP / Technology</SelectItem>
              <SelectItem value="private_equity">Private Equity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="bg-white rounded-lg border border-[#e5e0e7] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e5e0e7]">
          <h2 className="text-lg font-semibold text-[#1c151d]">Recent Applications</h2>
        </div>

        {sortedApplications.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-[#7c6b80] mb-4" />
            <h3 className="text-lg font-semibold text-[#1c151d] mb-2">
              No applications found
            </h3>
            <p className="text-[#7c6b80]">
              {statusFilter === 'all'
                ? 'No applications have been created yet.'
                : 'No applications found with this status.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#fafafa] hover:bg-[#fafafa]">
                  <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">
                    Candidate
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">
                    Practice Area
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedApplications.map((application) => {
                  const displayStatus = getDisplayStatus(application.status);
                  const config = statusConfig[displayStatus];
                  const isInProgress = displayStatus === 'in_progress';
                  
                  return (
                    <TableRow
                      key={application.id}
                      className="border-b border-[#e5e0e7] hover:bg-[#fafafa] cursor-pointer"
                      onClick={() => router.push(`/admin/applications/${application.id}`)}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-white text-sm font-semibold">
                              {getInitials(application.candidateName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-[#1c151d] text-sm">
                              {application.candidateName}
                            </p>
                            <p className="text-xs text-[#7c6b80] mt-0.5">
                              {application.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-[#1c151d]">
                          {application.applicationType === 'individual' ? 'Corporate / M&A' : 'Group Practice'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Badge className={`${config.color} font-medium text-xs w-fit`}>
                            {config.label}
                          </Badge>
                          {isInProgress && (
                            <div className="w-full max-w-[120px]">
                              <Progress value={application.completionPercentage} className="h-1.5" />
                              <span className="text-xs text-[#7c6b80] mt-1 block">
                                {application.completionPercentage}%
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#7c6b80] hover:bg-[#f0eef1]"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/admin/applications/${application.id}`);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#7c6b80] hover:bg-[#f0eef1]"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

