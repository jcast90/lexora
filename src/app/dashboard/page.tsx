import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  FolderOpen,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Send,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.5%",
    trend: "up" as const,
    icon: Users,
    description: "vs last month",
  },
  {
    title: "Active Projects",
    value: "184",
    change: "+8.2%",
    trend: "up" as const,
    icon: FolderOpen,
    description: "vs last month",
  },
  {
    title: "Revenue",
    value: "$48,295",
    change: "+23.1%",
    trend: "up" as const,
    icon: DollarSign,
    description: "vs last month",
  },
  {
    title: "Growth",
    value: "14.8%",
    change: "-2.4%",
    trend: "down" as const,
    icon: TrendingUp,
    description: "vs last month",
  },
];

const recentActivity = [
  {
    user: "Sarah Chen",
    action: "Created new project",
    target: "Marketing Dashboard",
    time: "2 min ago",
    status: "completed",
  },
  {
    user: "Mike Johnson",
    action: "Updated settings",
    target: "API Configuration",
    time: "15 min ago",
    status: "completed",
  },
  {
    user: "Emily Davis",
    action: "Invited team member",
    target: "alex@example.com",
    time: "1 hour ago",
    status: "pending",
  },
  {
    user: "James Wilson",
    action: "Deployed update",
    target: "v2.4.1",
    time: "3 hours ago",
    status: "completed",
  },
  {
    user: "Lisa Park",
    action: "Generated report",
    target: "Q4 Analytics",
    time: "5 hours ago",
    status: "completed",
  },
];

export default function DashboardPage() {
  return (
    <div className="px-4 py-8 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-white/50">
          Here&apos;s an overview of your account activity and metrics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`border-white/[0.06] bg-brand-surface-light text-white overflow-hidden ${index === 0 ? "relative" : ""}`}
            >
              {index === 0 && (
                <div className="absolute inset-x-0 top-0 h-[1px]" style={{ background: "linear-gradient(to right, var(--brand-primary), var(--brand-accent))" }} />
              )}
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="text-sm font-medium text-white/50">
                  {stat.title}
                </CardDescription>
                <div className="flex size-9 items-center justify-center rounded-lg bg-white/[0.06]">
                  <Icon className="size-4 text-white/40" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  <span
                    className={`inline-flex items-center gap-0.5 font-medium ${
                      stat.trend === "up" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="size-3" />
                    ) : (
                      <ArrowDownRight className="size-3" />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-white/40">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="border-white/[0.06] bg-brand-surface-light text-white lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-white">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-sm text-white/40">
                  Latest actions across your workspace
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/50 hover:text-white hover:bg-white/10"
              >
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="text-white/40">User</TableHead>
                  <TableHead className="text-white/40">Action</TableHead>
                  <TableHead className="text-white/40">Target</TableHead>
                  <TableHead className="text-right text-white/40">
                    Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity, i) => (
                  <TableRow
                    key={i}
                    className="border-white/[0.06] hover:bg-white/[0.03]"
                  >
                    <TableCell className="font-medium text-white/80">
                      {activity.user}
                    </TableCell>
                    <TableCell className="text-white/60">
                      {activity.action}
                    </TableCell>
                    <TableCell>
                      <span className="text-white/50">{activity.target}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-white/40">{activity.time}</span>
                        <Badge
                          variant={
                            activity.status === "completed"
                              ? "secondary"
                              : "outline"
                          }
                          className={
                            activity.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-white/[0.06] bg-brand-surface-light text-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-white">
              Quick Actions
            </CardTitle>
            <CardDescription className="text-sm text-white/40">
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-white/[0.08] bg-white/[0.03] text-white/80 hover:bg-white/[0.06] hover:text-white"
            >
              <div className="flex size-8 items-center justify-center rounded-md" style={{ background: "linear-gradient(to bottom right, color-mix(in srgb, var(--brand-primary) 15%, transparent), color-mix(in srgb, var(--brand-accent) 15%, transparent))" }}>
                <Plus className="size-4 text-brand-primary" />
              </div>
              Create New Project
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-white/[0.08] bg-white/[0.03] text-white/80 hover:bg-white/[0.06] hover:text-white"
            >
              <div className="flex size-8 items-center justify-center rounded-md" style={{ background: "linear-gradient(to bottom right, color-mix(in srgb, var(--brand-accent) 15%, transparent), color-mix(in srgb, var(--brand-primary) 15%, transparent))" }}>
                <Send className="size-4 text-brand-accent" />
              </div>
              Invite Team Members
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-white/[0.08] bg-white/[0.03] text-white/80 hover:bg-white/[0.06] hover:text-white"
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10">
                <Download className="size-4 text-emerald-400" />
              </div>
              Export Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
