'use client';

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FileText, Download, Plus, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import { useApplicationsListStore } from "@/stores/applications-list-store";
import { useLCQStore } from "@/stores/lcq-store";

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  additional_info_required: 'bg-orange-100 text-orange-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  additional_info_required: 'Info Required',
  approved: 'Approved',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuthStore();
  const { applications, loading, loadUserApplications, deleteApplication } = useApplicationsListStore();
  const initializeApplication = useLCQStore((s) => s.initializeApplication);
  const hasCheckedApplications = useRef(false);

  // Redirect admin users to admin applications page
  useEffect(() => {
    if (isAdmin) {
      router.replace('/admin/applications');
      return;
    }
  }, [isAdmin, router]);

  useEffect(() => {
    if (user && !isAdmin) {
      loadUserApplications(user.id);
    }
  }, [user, isAdmin, loadUserApplications]);

  // Auto-redirect candidates with no applications to start application workflow
  useEffect(() => {
    if (
      user &&
      !isAdmin &&
      !loading &&
      applications.length === 0 &&
      !hasCheckedApplications.current
    ) {
      hasCheckedApplications.current = true;
      const applicationId = initializeApplication(user.id, 'individual');
      router.replace(`/application/${applicationId}`);
    }
  }, [user, isAdmin, loading, applications.length, initializeApplication, router]);

  const handleDelete = (applicationId: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      deleteApplication(applicationId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap justify-between gap-3 items-center">
          <h1 className="text-[#1c151d] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
            Welcome, {user?.name}
          </h1>
          {!isAdmin && applications.length > 0 && (
            <Link href="/application/new">
              <Button className="h-12 px-6 bg-primary text-white text-base font-medium shadow-sm hover:bg-primary/90">
                <Plus className="h-5 w-5 mr-2" />
                New Application
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-[#1c151d] text-xl font-bold leading-tight tracking-[-0.015em]">
                  My Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {applications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-6 text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-[#7c6b80] text-base font-normal leading-normal">
                        No Applications Yet
                      </p>
                      <p className="text-[#7c6b80] text-sm font-normal leading-normal max-w-md">
                        You have not started your application yet. Click the button above to begin the integration process.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center gap-4 border border-[#e5e0e7] rounded-lg bg-white p-4 justify-between"
                      >
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="flex items-center gap-3">
                            <p className="text-[#1c151d] text-base font-semibold leading-normal">
                              {app.candidateName}
                            </p>
                            <Badge className={statusColors[app.status]}>
                              {statusLabels[app.status]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[#7c6b80]">
                            <span>{app.applicationType === 'individual' ? 'Individual' : 'Group'}</span>
                            <span>•</span>
                            <span>{app.completionPercentage}% Complete</span>
                            <span>•</span>
                            <span>Created {new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/application/${app.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-[#7c6b80] hover:bg-[#f0eef1] rounded-lg"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {app.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(app.id)}
                              className="h-9 w-9 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-0 h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-[#1c151d] text-lg font-bold leading-tight tracking-[-0.015em]">
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4 border border-[#e5e0e7] rounded-lg bg-white p-4 min-h-[72px] justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 h-12 w-12">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[#1c151d] text-base font-medium leading-normal line-clamp-1">
                          Benefits Guide
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#7c6b80] hover:bg-[#f0eef1] rounded-full"
                      >
                        <Download className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border border-[#e5e0e7] rounded-lg bg-white p-4 min-h-[72px] justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 h-12 w-12">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[#1c151d] text-base font-medium leading-normal line-clamp-1">
                          Partnership Track Info
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#7c6b80] hover:bg-[#f0eef1] rounded-full"
                      >
                        <Download className="h-5 w-5" />
                      </Button>
                    </div>
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
