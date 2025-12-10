"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/stores/auth-store";
import { useAdminSettingsStore } from "@/stores/admin-settings-store";

export default function SettingsPage() {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const { adminEmails, addAdminEmail, removeAdminEmail, loadAdminEmails } = useAdminSettingsStore();
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/applications');
      return;
    }
    loadAdminEmails();
  }, [isAdmin, router, loadAdminEmails]);

  const handleAddEmail = () => {
    setError(null);
    setSuccess(null);

    if (!newEmail.trim()) {
      setError("Please enter an email address");
      return;
    }

    try {
      addAdminEmail(newEmail);
      setNewEmail("");
      setSuccess("Admin email added successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add admin email");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setError(null);
    setSuccess(null);

    try {
      removeAdminEmail(email);
      setSuccess("Admin email removed successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove admin email");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddEmail();
    }
  };

  return (
    <div className="max-w-full w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[#1c151d] text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-[#7c6b80] mt-1">
          Manage admin user access
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-500 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Admin Emails Management */}
      <Card className="border border-[#e5e0e7]">
        <CardHeader>
          <CardTitle className="text-[#1c151d] flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Admin Email Access
          </CardTitle>
          <p className="text-sm text-[#7c6b80] mt-2">
            Add or remove email addresses that have admin access to the platform. Users with these emails will have admin privileges when they log in.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Email Form */}
          <div className="flex gap-3">
            <Input
              type="email"
              placeholder="Enter email address (e.g., user@dentons.com)"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={handleAddEmail} className="bg-primary text-white hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              Add Admin Email
            </Button>
          </div>

          {/* Admin Emails List */}
          <div className="border-t border-[#e5e0e7] pt-6">
            <h3 className="text-sm font-semibold text-[#7c6b80] uppercase mb-4">
              Admin Emails ({adminEmails.length})
            </h3>
            {adminEmails.length === 0 ? (
              <div className="text-center py-8 text-[#7c6b80]">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No admin emails configured</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#fafafa] hover:bg-[#fafafa]">
                      <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Email Address</TableHead>
                      <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase">Status</TableHead>
                      <TableHead className="text-xs font-semibold text-[#7c6b80] uppercase text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminEmails.map((email) => {
                      const isDefault = email === 'admin@dentons.com';
                      return (
                        <TableRow key={email} className="border-b border-[#e5e0e7] hover:bg-[#fafafa]">
                          <TableCell className="font-medium text-[#1c151d]">{email}</TableCell>
                          <TableCell>
                            {isDefault ? (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                                Default Admin
                              </span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded font-medium">
                                Custom
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {!isDefault && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveEmail(email)}
                                className="h-8 w-8 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Info Box */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <strong>Note:</strong> Users with these email addresses will automatically receive admin access when they log in. 
              Make sure the email addresses are valid and belong to authorized personnel only. The default admin email cannot be removed.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

