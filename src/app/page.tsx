import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Shield, FileLock, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f7f6f8] overflow-x-hidden">
      <div className="flex h-full grow flex-col">
        <main className="flex-1">
          <div
            className="relative flex h-screen min-h-[700px] w-full flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAVZSsgoiLASZ06QHVMXEdRH3rV-WDCkrok82QhciEF4AHHPdCmpxbp0aLrAIh_wCmGH5ZnzTvzHdqCYPXSaTA8hMrZAcnmZAhXH4L3B4kMBQIfcFK_QN77Y5vgQzL8OswPX8xvBM6YqW6ltEWODVuUC_Cq00a98uz6h1G6is3MgGgZZrU-gUXLNLs4BZyr8BKwdE5qWzbaf0wIBsW6xogqCgARAIs_5dl8N4tSe8-stvCtjMDq9CIJwbusV__JFdWzdpkif0EEDbJC")`,
            }}
          >
            <div className="flex max-w-4xl flex-col items-center gap-8 p-8 text-center">
              <Logo />

              <h1 className="text-5xl font-black leading-tight tracking-tighter text-white md:text-6xl">
                Global Reach, Local Depth: Join the World&apos;s Largest Law
                Firm.
              </h1>

              <p className="text-lg text-white/90">
                Leverage our unparalleled platform to accelerate your practice.
                We provide the tools, network, and support for the world&apos;s
                leading legal professionals.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/sign-up"
                  className="flex h-12 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-6 text-base font-bold text-white shadow-lg transition-transform hover:scale-105"
                >
                  <span className="truncate">Apply as Partner</span>
                </Link>
                <Link
                  href="/admin-sign-in"
                  className="flex h-12 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-6 text-base font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-white/20"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="truncate">Admin Login</span>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <footer className="flex flex-col gap-6 bg-[#f7f6f8] px-5 py-10">
          <div className="mx-auto max-w-4xl w-full">
            <h2 className="text-2xl font-bold text-[#1c151d] text-center mb-6">
              Your Information is Protected
            </h2>
            <p className="text-base text-[#7c6b80] text-center mb-8 max-w-3xl mx-auto">
              All data submitted through this portal is encrypted, access-controlled, and handled in strict accordance with legal industry confidentiality standards. Your application details are never shared outside the Dentons lateral hiring team.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              <div className="flex items-center gap-2 text-[#7c6b80]">
                <FileLock className="h-5 w-5 text-primary" />
                <span className="text-base font-normal leading-normal">
                  Encrypted Storage
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#7c6b80]">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-base font-normal leading-normal">
                  Access Control
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-[#7c6b80] text-center mt-4">
            &copy; 2024 Dentons. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
