import { AIAssistant } from "@/components/application/ai-assistant";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f7f6f8] overflow-x-hidden">
      <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-screen-xl flex-col gap-8 min-w-0">
          {children}
        </div>
      </main>
      <AIAssistant />
    </div>
  );
}
