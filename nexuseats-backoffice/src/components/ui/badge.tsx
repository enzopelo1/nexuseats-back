import { cn } from "@/lib/utils";
export const Badge = ({ className, children, variant = "default" }: { className?: string; children: React.ReactNode; variant?: "default" | "outline" | "success" | "warning" | "danger" }) => {
  const colors = {
    default: "bg-primary/10 text-primary",
    outline: "border border-input text-foreground",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
  }[variant];
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", colors, className)}>{children}</span>;
};
