"use client";

import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorCardProps {
  title?: string;
  description?: string;
}

export default function ErrorCard({
  title = "Something went wrong",
  description = "We encountered an error while fetching your data. Please try again or contact support if the problem persists.",
}: ErrorCardProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="rounded-lg bg-red-50 dark:bg-red-900/10 p-4 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              <strong>Error Code:</strong> FETCH_FAILED
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
