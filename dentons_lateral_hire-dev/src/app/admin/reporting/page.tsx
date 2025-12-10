"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Download, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import { useApplicationsListStore } from "@/stores/applications-list-store";

const candidateData = [
  {
    name: "Alexandra Thompson",
    practiceArea: "Private Equity",
    portableRevenue: 4210000,
    keyClients: 15,
    avgTenure: 6.3,
    teamMembers: "4 associates",
    associates: "2 senior, 2 junior",
    paralegals: 2,
    supportStaff: 1,
    totalHeadcount: 7,
  },
  {
    name: "Michael Rodriguez",
    practiceArea: "Litigation",
    portableRevenue: 3120000,
    keyClients: 12,
    avgTenure: 4.8,
    teamMembers: "3 associates",
    associates: "2 senior, 1 junior",
    paralegals: 1,
    supportStaff: 1,
    totalHeadcount: 5,
  },
  {
    name: "Sarah Chen",
    practiceArea: "Corporate / M&A",
    portableRevenue: 2450000,
    keyClients: 8,
    avgTenure: 5.2,
    teamMembers: "2 associates",
    associates: "1 senior, 1 junior",
    paralegals: 1,
    supportStaff: 0,
    totalHeadcount: 3,
  },
  {
    name: "Jennifer Park",
    practiceArea: "IP / Technology",
    portableRevenue: 1870000,
    keyClients: 6,
    avgTenure: 4.1,
    teamMembers: "1 associate",
    associates: "1 junior",
    paralegals: 0,
    supportStaff: 0,
    totalHeadcount: 2,
  },
];

const dueDiligenceFlags = [
  {
    candidate: "Robert Martinez",
    issueType: "Malpractice Claim",
    severity: "HIGH",
    description: "Pending malpractice claim from 2022",
    status: "UNDER REVIEW",
  },
  {
    candidate: "David Chen",
    issueType: "Tax Lien",
    severity: "MEDIUM",
    description: "State tax lien filed in 2021, $45K",
    status: "RESOLVED",
  },
  {
    candidate: "Alexandra Thompson",
    issueType: "Client Conflict",
    severity: "HIGH",
    description: "Confirmed conflict with existing client",
    status: "UNDER REVIEW",
  },
  {
    candidate: "Michael Rodriguez",
    issueType: "Potential Conflict",
    severity: "MEDIUM",
    description: "2 potential conflicts being investigated",
    status: "UNDER REVIEW",
  },
  {
    candidate: "Patricia Wong",
    issueType: "Bar Complaint",
    severity: "LOW",
    description: "Dismissed bar complaint from 2019",
    status: "RESOLVED",
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "HIGH":
      return "bg-red-100 text-red-800";
    case "MEDIUM":
      return "bg-orange-100 text-orange-800";
    case "LOW":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getMaxValue = (data: typeof candidateData, key: 'portableRevenue' | 'totalHeadcount') => {
  return Math.max(...data.map(item => item[key]));
};

export default function ReportingPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const { applications, loadAllApplications } = useApplicationsListStore();

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/applications');
      return;
    }
    loadAllApplications();
  }, [isAdmin, router, loadAllApplications]);

  const maxRevenue = getMaxValue(candidateData, 'portableRevenue');
  const maxHeadcount = getMaxValue(candidateData, 'totalHeadcount');
  const totalApplicants = applications.length || 47;
  const withFlags = dueDiligenceFlags.length;
  const categoriesOfIssues = new Set(dueDiligenceFlags.map(flag => flag.issueType)).size;
  const unresolvedItems = dueDiligenceFlags.filter(flag => flag.status === 'UNDER REVIEW').length;

  return (
    <div className="max-w-full w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">
              Reporting
            </h1>
            <p className="text-[#7c6b80] mt-1">
              Comprehensive analytics and insights
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export All Reports
          </Button>
        </div>
      </div>

      {/* Due Diligence Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#1c151d] mb-4">Due Diligence Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-[#e5e0e7]">
            <CardContent className="p-6">
              <p className="text-sm text-[#7c6b80] mb-2">Total Applicants</p>
              <p className="text-2xl font-bold text-[#1c151d]">{totalApplicants}</p>
            </CardContent>
          </Card>
          <Card className="border border-[#e5e0e7] bg-red-50">
            <CardContent className="p-6">
              <p className="text-sm text-[#7c6b80] mb-2">With Flags</p>
              <p className="text-2xl font-bold text-[#1c151d]">{withFlags}</p>
            </CardContent>
          </Card>
          <Card className="border border-[#e5e0e7] bg-yellow-50">
            <CardContent className="p-6">
              <p className="text-sm text-[#7c6b80] mb-2">Categories of Issues</p>
              <p className="text-2xl font-bold text-[#1c151d]">{categoriesOfIssues}</p>
            </CardContent>
          </Card>
          <Card className="border border-[#e5e0e7] bg-blue-50">
            <CardContent className="p-6">
              <p className="text-sm text-[#7c6b80] mb-2">Unresolved Items</p>
              <p className="text-2xl font-bold text-[#1c151d]">{unresolvedItems}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Book of Business Comparison */}
      <div className="mb-6">
        <Card className="border border-[#e5e0e7]">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-[#1c151d] mb-6">Book of Business Comparison</h2>
            
            {/* Bar Chart */}
            <div className="mb-6 space-y-4">
              {candidateData.map((candidate) => {
                const percentage = (candidate.portableRevenue / maxRevenue) * 100;
                return (
                  <div key={candidate.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#1c151d]">{candidate.name}</span>
                      <span className="text-sm font-semibold text-[#1c151d]">
                        {formatCurrency(candidate.portableRevenue)}
                      </span>
                    </div>
                    <div className="w-full bg-[#f0eef1] rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          {formatCurrency(candidate.portableRevenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#fafafa] hover:bg-[#fafafa]">
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Candidate</TableHead>
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Practice Area</TableHead>
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Portable Revenue</TableHead>
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Key Clients</TableHead>
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Avg Tenure</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidateData.map((candidate) => (
                    <TableRow key={candidate.name} className="border-b border-[#e5e0e7] hover:bg-[#fafafa]">
                      <TableCell className="font-medium text-[#1c151d]">{candidate.name}</TableCell>
                      <TableCell className="text-sm text-[#1c151d]">{candidate.practiceArea}</TableCell>
                      <TableCell className="text-sm font-semibold text-[#1c151d]">
                        {formatCurrency(candidate.portableRevenue)}
                      </TableCell>
                      <TableCell className="text-sm text-[#1c151d]">{candidate.keyClients} clients</TableCell>
                      <TableCell className="text-sm text-[#1c151d]">{candidate.avgTenure} years</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Headcount Transfer Analysis */}
      <div className="mb-6">
        <Card className="border border-[#e5e0e7]">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-[#1c151d]">Headcount Transfer Analysis</h2>
            </div>
            
            {/* Bar Chart */}
            <div className="mb-6 space-y-4">
              {candidateData.map((candidate) => {
                const percentage = (candidate.totalHeadcount / maxHeadcount) * 100;
                return (
                  <div key={candidate.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#1c151d]">{candidate.name}</span>
                      <span className="text-sm font-semibold text-[#1c151d]">{candidate.totalHeadcount}</span>
                    </div>
                    <div className="w-full bg-[#f0eef1] rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-[#f97316] h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          {candidate.totalHeadcount}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#fafafa] hover:bg-[#fafafa]">
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Candidate</TableHead>
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Team Members</TableHead>
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Associates</TableHead>
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Paralegals</TableHead>
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Support Staff</TableHead>
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Total Headcount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidateData.map((candidate) => (
                    <TableRow key={candidate.name} className="border-b border-[#e5e0e7] hover:bg-[#fafafa]">
                      <TableCell className="font-medium text-[#1c151d]">{candidate.name}</TableCell>
                      <TableCell className="text-sm text-[#1c151d]">{candidate.teamMembers}</TableCell>
                      <TableCell className="text-sm text-[#1c151d]">{candidate.associates}</TableCell>
                      <TableCell className="text-sm text-[#1c151d]">{candidate.paralegals}</TableCell>
                      <TableCell className="text-sm text-[#1c151d]">{candidate.supportStaff}</TableCell>
                      <TableCell className="text-sm font-semibold text-[#1c151d]">{candidate.totalHeadcount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Due Diligence Flags */}
      <div className="mb-6">
        <Card className="border border-[#e5e0e7]">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-[#1c151d]">Due Diligence Flags</h2>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#fafafa] hover:bg-[#fafafa]">
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Candidate</TableHead>
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Issue Type</TableHead>
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Severity</TableHead>
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Description</TableHead>
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dueDiligenceFlags.map((flag, index) => (
                    <TableRow key={index} className="border-b border-[#e5e0e7] hover:bg-[#fafafa]">
                      <TableCell className="font-medium text-[#1c151d]">{flag.candidate}</TableCell>
                      <TableCell className="text-sm text-[#1c151d]">{flag.issueType}</TableCell>
                      <TableCell>
                        <Badge className={`${getSeverityColor(flag.severity)} font-medium text-xs`}>
                          {flag.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-[#1c151d]">{flag.description}</TableCell>
                      <TableCell className="text-sm text-[#1c151d]">{flag.status}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#7c6b80] hover:bg-[#f0eef1]">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

