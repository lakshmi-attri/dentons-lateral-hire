"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/stores/auth-store";
import { useApplicationsListStore } from "@/stores/applications-list-store";
import type { ApplicationStatus } from "@/types/application";

const statusConfig = {
  draft: { label: "Draft", color: "bg-gray-500", icon: FileText },
  submitted: { label: "Submitted", color: "bg-blue-500", icon: CheckCircle },
  under_review: { label: "Under Review", color: "bg-yellow-500", icon: Clock },
  additional_info_required: { label: "Info Required", color: "bg-orange-500", icon: AlertCircle },
  approved: { label: "Approved", color: "bg-green-500", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500", icon: AlertCircle },
  withdrawn: { label: "Withdrawn", color: "bg-gray-400", icon: FileText },
};

export default function ApplicationsPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuthStore();
  const { applications, loading, loadUserApplications, loadAllApplications } = useApplicationsListStore();
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');

  // Redirect admin users to admin applications page
  useEffect(() => {
    if (isAdmin) {
      router.replace('/admin/applications');
      return;
    }
  }, [isAdmin, router]);

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (!isAdmin) {
      loadUserApplications(user.id);
    }
  }, [user, isAdmin, loadUserApplications, router]);

  const filteredApplications = statusFilter === 'all'
    ? applications
    : applications.filter(app => app.status === statusFilter);

  const sortedApplications = [...filteredApplications].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleNewApplication = () => {
    router.push('/application/new');
  };

  const handleViewApplication = (applicationId: string) => {
    router.push(`/application/${applicationId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-[#7c6b80]">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">
            {isAdmin ? 'All Applications' : 'My Applications'}
          </h1>
          <p className="text-[#7c6b80] mt-2">
            {isAdmin
              ? 'Manage and review all partner applications'
              : 'View and manage your lateral partner applications'}
          </p>
        </div>
        {!isAdmin && (
          <Button
            onClick={handleNewApplication}
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Application
          </Button>
        )}
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#1c151d]">Filter by status:</span>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as ApplicationStatus | 'all')}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="additional_info_required">Info Required</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-[#7c6b80]">
          {sortedApplications.length} {sortedApplications.length === 1 ? 'application' : 'applications'}
        </div>
      </div>

      {sortedApplications.length === 0 ? (
        <Card className="border border-[#e5e0e7]">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-[#7c6b80] mb-4" />
            <h3 className="text-lg font-semibold text-[#1c151d] mb-2">
              No applications found
            </h3>
            <p className="text-[#7c6b80] mb-6">
              {statusFilter === 'all'
                ? isAdmin
                  ? 'No applications have been created yet.'
                  : 'You haven\'t started any applications yet. Create your first application to begin.'
                : 'No applications found with this status.'}
            </p>
            {!isAdmin && statusFilter === 'all' && (
              <Button
                onClick={handleNewApplication}
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Application
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedApplications.map((application) => {
            const config = statusConfig[application.status];
            const StatusIcon = config.icon;

            return (
              <Card
                key={application.id}
                className="border border-[#e5e0e7] hover:border-[#c9c0cc] transition-colors cursor-pointer"
                onClick={() => handleViewApplication(application.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#1c151d] truncate">
                          {application.candidateName}
                        </h3>
                        <Badge
                          className={`${config.color} text-white shrink-0`}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Badge>
                        <Badge variant="outline" className="shrink-0">
                          {application.applicationType === 'individual' ? 'Individual' : 'Group'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-[#7c6b80] mb-4">
                        {application.email && (
                          <span className="truncate">{application.email}</span>
                        )}
                        <span className="shrink-0">Created: {formatDate(application.createdAt)}</span>
                        <span className="shrink-0">Updated: {formatDate(application.updatedAt)}</span>
                        {isAdmin && (
                          <span className="shrink-0 text-xs bg-[#f0eef1] px-2 py-1 rounded">
                            User ID: {application.userId.slice(0, 8)}...
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-[#7c6b80]">Completion</span>
                            <span className="font-medium text-[#1c151d]">
                              {application.completionPercentage}%
                            </span>
                          </div>
                          <Progress value={application.completionPercentage} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewApplication(application.id);
                      }}
                      className="shrink-0"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
