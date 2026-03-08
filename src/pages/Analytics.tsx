import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Users, Building2, CheckCircle2, Clock,
  Baby, PieChart as PieChartIcon, Activity, MapPin
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area,
} from "recharts";
import { useStore } from "@/lib/store";

const CHART_COLORS = {
  primary: "hsl(215 80% 42%)",
  accent: "hsl(195 85% 42%)",
  success: "hsl(152 60% 38%)",
  warning: "hsl(38 92% 50%)",
  destructive: "hsl(0 72% 51%)",
  muted: "hsl(215 15% 50%)",
  purple: "hsl(270 60% 50%)",
  pink: "hsl(330 60% 50%)",
};

const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.accent, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.purple, CHART_COLORS.pink, CHART_COLORS.destructive, CHART_COLORS.muted];

function StatCard({ icon: Icon, label, value, sub, color = "primary" }: { icon: any; label: string; value: string | number; sub?: string; color?: string }) {
  const bgMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-5 shadow-card"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${bgMap[color] || bgMap.primary}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-body">{label}</p>
          <p className="text-xl font-bold text-card-foreground">{value}</p>
          {sub && <p className="text-[10px] text-muted-foreground font-body mt-0.5">{sub}</p>}
        </div>
      </div>
    </motion.div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card shadow-card overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-bold text-card-foreground font-body">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground font-body mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

export default function Analytics() {
  const { records, activities } = useStore();

  const stats = useMemo(() => {
    const total = records.length;
    const approved = records.filter((r) => r.status === "Approved").length;
    const pending = records.filter((r) => r.status === "Pending").length;
    const male = records.filter((r) => r.record.gender === "Male").length;
    const female = total - male;
    const verifications = activities.filter((a) => a.type === "verify").length;
    return { total, approved, pending, male, female, verifications };
  }, [records, activities]);

  // Monthly trend
  const monthlyTrend = useMemo(() => {
    const map = new Map<string, { month: string; created: number; approved: number }>();
    records.forEach((r) => {
      const d = new Date(r.createdAt);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
      if (!map.has(key)) map.set(key, { month: label, created: 0, approved: 0 });
      const entry = map.get(key)!;
      entry.created++;
      if (r.status === "Approved") entry.approved++;
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [records]);

  // Gender ratio
  const genderData = useMemo(() => [
    { name: "Male", value: stats.male },
    { name: "Female", value: stats.female },
  ], [stats]);

  // Status breakdown
  const statusData = useMemo(() => [
    { name: "Approved", value: stats.approved },
    { name: "Pending", value: stats.pending },
  ], [stats]);

  // Hospital-wise top 10
  const hospitalStats = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => {
      // Extract hospital name (before first comma)
      const name = r.record.hospitalAddress.split(",")[0].trim();
      map.set(name, (map.get(name) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([hospital, count]) => ({ hospital, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [records]);

  // State-wise distribution
  const stateStats = useMemo(() => {
    const map = new Map<string, number>();
    records.forEach((r) => {
      // Extract state from address (between last comma and pin)
      const parts = r.record.hospitalAddress.split(",");
      const statepart = parts.length >= 2 ? parts[parts.length - 1].replace(/–.*/, "").trim() : "Unknown";
      map.set(statepart, (map.get(statepart) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [records]);

  // Daily activity (last 30 days)
  const dailyActivity = useMemo(() => {
    const now = Date.now();
    const days: { day: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toLocaleDateString("default", { month: "short", day: "numeric" });
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      const end = start + 86400000;
      const count = activities.filter((a) => a.timestamp >= start && a.timestamp < end).length;
      days.push({ day: key, count });
    }
    return days;
  }, [activities]);

  // Approval rate
  const approvalRate = stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(1) : "0";

  const customTooltipStyle = {
    backgroundColor: "hsl(215 55% 16%)",
    border: "1px solid hsl(215 25% 30%)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "12px",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-sm text-muted-foreground font-body">Birth registration statistics & insights</p>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Baby} label="Total Records" value={stats.total} color="primary" />
        <StatCard icon={CheckCircle2} label="Approved" value={stats.approved} sub={`${approvalRate}% rate`} color="success" />
        <StatCard icon={Clock} label="Pending" value={stats.pending} color="warning" />
        <StatCard icon={Users} label="Male" value={stats.male} color="primary" />
        <StatCard icon={Users} label="Female" value={stats.female} color="accent" />
        <StatCard icon={Activity} label="Verifications" value={stats.verifications} color="success" />
      </div>

      {/* Row 1: Monthly Trend + Gender */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Monthly Registration Trend" subtitle="Created vs Approved certificates per month">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215 15% 50%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 50%)" }} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="created" name="Created" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                <Bar dataKey="approved" name="Approved" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Gender Distribution" subtitle="Male vs Female births">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                <Cell fill={CHART_COLORS.primary} />
                <Cell fill={CHART_COLORS.accent} />
              </Pie>
              <Tooltip contentStyle={customTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: CHART_COLORS.primary }} />
              <span className="text-xs text-muted-foreground font-body">Male ({stats.male})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: CHART_COLORS.accent }} />
              <span className="text-xs text-muted-foreground font-body">Female ({stats.female})</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Row 2: Hospital Stats + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Top 10 Hospitals" subtitle="By number of birth registrations">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={hospitalStats} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 88%)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(215 15% 50%)" }} />
                <YAxis dataKey="hospital" type="category" tick={{ fontSize: 10, fill: "hsl(215 15% 50%)" }} width={140} />
                <Tooltip contentStyle={customTooltipStyle} />
                <Bar dataKey="count" name="Registrations" fill={CHART_COLORS.accent} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="space-y-6">
          <ChartCard title="Status Breakdown">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill={CHART_COLORS.success} />
                  <Cell fill={CHART_COLORS.warning} />
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: CHART_COLORS.success }} />
                <span className="text-xs text-muted-foreground font-body">Approved ({stats.approved})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: CHART_COLORS.warning }} />
                <span className="text-xs text-muted-foreground font-body">Pending ({stats.pending})</span>
              </div>
            </div>
          </ChartCard>

          {/* Approval Rate Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-6 shadow-card text-center"
          >
            <p className="text-xs text-muted-foreground font-body mb-2">Approval Rate</p>
            <p className="text-4xl font-bold text-success">{approvalRate}%</p>
            <div className="w-full bg-muted rounded-full h-2 mt-3">
              <div
                className="bg-success h-2 rounded-full transition-all"
                style={{ width: `${approvalRate}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground font-body mt-2">
              {stats.approved} of {stats.total} certificates approved
            </p>
          </motion.div>
        </div>
      </div>

      {/* Row 3: Daily Activity + State Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Daily Activity (Last 30 Days)" subtitle="All blockchain events per day">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyActivity}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 88%)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(215 15% 50%)" }} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 50%)" }} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Area type="monotone" dataKey="count" name="Events" stroke={CHART_COLORS.primary} fill="url(#areaGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="State-wise Distribution" subtitle="Top states by registrations">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stateStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 25% 88%)" />
              <XAxis dataKey="state" tick={{ fontSize: 9, fill: "hsl(215 15% 50%)" }} angle={-35} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 50%)" }} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="count" name="Registrations" radius={[4, 4, 0, 0]}>
                {stateStats.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
