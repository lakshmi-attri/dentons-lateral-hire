import { cn } from "@/lib/utils";

export type CandidateStatus =
  | "new"
  | "under_review"
  | "conflicts_check"
  | "offer_extended";

interface StatusBadgeProps {
  status: CandidateStatus;
}

const statusConfig: Record<
  CandidateStatus,
  { label: string; className: string }
> = {
  new: {
    label: "New",
    className: "bg-blue-100 text-blue-800",
  },
  under_review: {
    label: "Under Review",
    className: "bg-yellow-100 text-yellow-800",
  },
  conflicts_check: {
    label: "Conflicts Check",
    className: "bg-indigo-100 text-indigo-800",
  },
  offer_extended: {
    label: "Offer Extended",
    className: "bg-green-100 text-green-800",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
