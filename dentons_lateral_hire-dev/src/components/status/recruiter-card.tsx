import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface RecruiterCardProps {
  name: string;
  email: string;
  imageUrl: string;
}

export function RecruiterCard({ name, email, imageUrl }: RecruiterCardProps) {
  return (
    <Card className="shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-0 overflow-hidden">
      <div
        className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover"
        style={{ backgroundImage: `url("${imageUrl}")` }}
      />
      <CardContent className="p-6">
        <div className="flex w-full flex-col items-stretch justify-center gap-2">
          <p className="text-primary text-sm font-medium leading-normal">
            Dedicated Support
          </p>
          <p className="text-[#1c151d] text-xl font-bold leading-tight tracking-[-0.015em]">
            Your Lateral Recruiter
          </p>
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1">
              <p className="text-[#1c151d] text-base font-medium leading-normal">
                {name}
              </p>
              <p className="text-[#7c6b80] text-base font-normal leading-normal">
                Have a question? Feel free to reach out.
              </p>
            </div>
            <Button className="w-full h-10 bg-primary text-white text-sm font-medium hover:opacity-90">
              {email}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
