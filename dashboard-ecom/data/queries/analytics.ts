import fetcher from "@/lib/fetcher";
import useSWR from "swr";
import { OverviewData } from "@/types/analytics";

export function useOverview(days: number = 14) {
  return useSWR<OverviewData>(`/analytics/overview?days=${days}`, fetcher, {
    keepPreviousData: true,
  });
}