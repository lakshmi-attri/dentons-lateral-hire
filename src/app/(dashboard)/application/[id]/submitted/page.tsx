"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useLCQStore } from "@/stores/lcq-store";

export default function SubmittedPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const { user } = useAuthStore();
  const loadApplication = useLCQStore((s) => s.loadApplication);
  const contactInfo = useLCQStore((s) => s.contactInfo);

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (applicationId) {
      loadApplication(applicationId);
    }
  }, [user, applicationId, loadApplication, router]);

  return (
    <div className="max-w-3xl mx-auto w-full">
      <Card className="border border-[#e5e0e7] shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-[#1c151d] mb-4">
            Application Submitted Successfully!
          </h1>

          <p className="text-lg text-[#7c6b80] mb-6">
            Thank you for your interest in joining Dentons, {contactInfo.legalFirstName}. Your application has been received
            and is now under review.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
            <h2 className="font-semibold text-lg mb-3">What happens next?</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Our recruitment team will review your application within 5-7 business days.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>You will receive an email confirmation at {contactInfo.personalEmail || "the address you provided"}.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>If your profile matches our current needs, we will contact you to schedule an interview.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>You can track your application status by logging into your account.</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => router.push('/dashboard')}
              variant="default"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => router.push('/status')}
              variant="outline"
            >
              View Application Status
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-8">
            If you have any questions, please contact us at{" "}
            <a href="mailto:recruiting@dentons.com" className="text-blue-600 hover:underline">
              recruiting@dentons.com
            </a>
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Application ID: {applicationId}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
