import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Timeline, TimelineStage } from "@/components/status/timeline";
import { RecruiterCard } from "@/components/status/recruiter-card";

const timelineStages: TimelineStage[] = [
  {
    id: "1",
    title: "Application Submitted",
    status: "completed",
    statusText: "Completed on 12th July 2024",
    icon: "check",
  },
  {
    id: "2",
    title: "Conflict Check in Progress",
    status: "in_progress",
    statusText: "Active",
    icon: "sync",
  },
  {
    id: "3",
    title: "Committee Review",
    status: "upcoming",
    statusText: "Upcoming",
    icon: "groups",
  },
  {
    id: "4",
    title: "Offer",
    status: "upcoming",
    statusText: "Upcoming",
    icon: "award",
  },
];

export default function StatusPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f7f6f8] overflow-x-hidden">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e5e0e7] px-10 py-3 bg-white sticky top-0 z-10">
        <Link
          href="/dashboard"
          className="flex items-center gap-4 text-primary"
        >
          <div className="h-6 w-6">
            <svg
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-[#1c151d] text-lg font-bold leading-tight tracking-[-0.015em]">
            Dentons Lateral Partner Integration Platform
          </h2>
        </Link>
        <div className="flex flex-1 justify-end gap-8">
          <nav className="flex items-center gap-9">
            <Link
              href="/dashboard"
              className="text-[#7c6b80] hover:text-primary text-sm font-medium leading-normal"
            >
              Dashboard
            </Link>
            <Link
              href="/status"
              className="text-primary text-sm font-bold leading-normal"
            >
              Applications
            </Link>
            <Link
              href="#"
              className="text-[#7c6b80] hover:text-primary text-sm font-medium leading-normal"
            >
              Documents
            </Link>
            <Link
              href="#"
              className="text-[#7c6b80] hover:text-primary text-sm font-medium leading-normal"
            >
              Help
            </Link>
          </nav>
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEh3fVgcDCwVNcgW-8QJo_7eBepQXzy6vROHuya6b8Khc6lshjEW6oK_8-j23zRx3v_4nWMtjZd2H95oFVoI9WsP8MFqQ6hRw2hvwbiA61126mR_pMfKJWtIYSS7aAJDBaEU0rRsPcvpOm52aNAeYny1Edi0nG6oSgfCjo8rVyPX7M75HXB5qQlwpLm1uqvWJqaxFkoGJ9AbMsBoXkSlR8ZWOgmlBcw1_PDOofRZdyw5GYC_HPriBGXi-L2joXWETXl5pXkmskCM4a"
              alt="User"
            />
            <AvatarFallback className="bg-primary text-white">SM</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-10">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <h1 className="text-[#1c151d] text-4xl font-black leading-tight tracking-[-0.033em]">
                Your Application Status
              </h1>
              <p className="text-[#7c6b80] text-base font-normal leading-normal">
                Track the progress of your lateral partner application.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 p-4">
            <div className="lg:col-span-2">
              <Timeline stages={timelineStages} />
            </div>

            <div className="lg:col-span-1">
              <RecruiterCard
                name="Johnathan Smith"
                email="jsmith@dentons.com"
                imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCf_Hf1VqZAfSMowk0secn9JiWIXLT_cQSMsXyETO0ZrS8l__HeZsaKru2sPPnZ0G0VI7Srgh-NmUdT9iumfZ-9oi-6FsIXvqk_SMKD0NIz8hkkgfAFs6g0-V0x32fyKA4U-iTxmQbclBX4ObqpJBZ-lB6IXSUsXSHD1371EKqmdGc8Nm7nI7x3lwke4Zu-A_kP723DwsT6QelNOkmEtqg-pZof8MuORz02OOxY9znGL1UL7LuS6RCooR21xzfiG5L0MuK81XVnE3Dd"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
