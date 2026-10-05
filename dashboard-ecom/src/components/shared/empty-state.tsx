import { LucideIcon } from "lucide-react";
import React from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
        <Icon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}
