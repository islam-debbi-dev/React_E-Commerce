import { MessageCircle, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ChannelSummary } from "@/types/analytics";
import { formatNumber } from "@/lib/format";

type ChannelSplitProps = {
  channels: ChannelSummary;
  loading?: boolean;
};

const ROWS = [
  { key: "telegram", label: "Telegram", icon: Send },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle },
] as const;

export default function ChannelSplit({
  channels,
  loading = false,
}: ChannelSplitProps) {
  const total = channels.telegram + channels.whatsapp;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by channel</CardTitle>
        <CardDescription>Where customers placed the order</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {ROWS.map(({ key, label, icon: Icon }) => {
          const value = channels[key];
          const share = total ? Math.round((value / total) * 100) : 0;

          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {loading ? "—" : `${share}%`}
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {loading ? "—" : formatNumber(value)}
                  </span>
                </div>
              </div>
              <Progress value={loading ? 0 : share} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}