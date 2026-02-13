import { db } from "@/db";
import { users, subscriptions, payments, plans } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { formatCurrency, formatNumber, translations } from "@/lib/utils";
import { Users, CreditCard, DollarSign, Activity } from "lucide-react";

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Total users
  const totalUsersResult = await db
    .select({ count: users.id })
    .from(users)
    .where(eq(users.isActive, true));
  const totalUsers = totalUsersResult.length;

  // Active subscriptions
  const activeSubscriptionsResult = await db
    .select({ count: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.status, "active"));
  const activeSubscriptions = activeSubscriptionsResult.length;

  // Monthly revenue
  const monthlyPayments = await db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.status, "completed"),
        gte(payments.createdAt, startOfMonth)
      )
    );
  const monthlyRevenue = monthlyPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  // Total plans
  const totalPlansResult = await db
    .select({ count: plans.id })
    .from(plans)
    .where(eq(plans.isActive, true));
  const totalPlans = totalPlansResult.length;

  return {
    totalUsers,
    activeSubscriptions,
    monthlyRevenue,
    totalPlans,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    {
      label: translations.totalUsers,
      value: formatNumber(stats.totalUsers),
      icon: Users,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
    },
    {
      label: translations.activeSubscriptions,
      value: formatNumber(stats.activeSubscriptions),
      icon: CreditCard,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: translations.monthlyRevenue,
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      label: translations.plans,
      value: formatNumber(stats.totalPlans),
      icon: Activity,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          {translations.dashboard}
        </h1>
        <p className="text-slate-400 mt-1">خوش آمدید، مدیر محترم</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className={`stat-card animate-fade-in stagger-${index + 1}`}
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <p className="stat-value">{stat.value}</p>
              <p className="stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          اقدامات سریع
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/users?action=add"
            className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Users className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="font-medium text-slate-200">{translations.addUser}</p>
              <p className="text-xs text-slate-400">افزودن کاربر جدید</p>
            </div>
          </a>
          <a
            href="/admin/plans?action=add"
            className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-medium text-slate-200">{translations.addPlan}</p>
              <p className="text-xs text-slate-400">ایجاد پلن جدید</p>
            </div>
          </a>
          <a
            href="/admin/payments"
            className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-slate-200">
                {translations.paymentHistory}
              </p>
              <p className="text-xs text-slate-400">مشاهده تراکنش‌ها</p>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          {translations.recentActivity}
        </h2>
        <div className="text-center py-8 text-slate-400">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>فعالیت اخیری وجود ندارد</p>
        </div>
      </div>
    </div>
  );
}
