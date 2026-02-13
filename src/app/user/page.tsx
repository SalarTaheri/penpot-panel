import { db } from "@/db";
import { subscriptions, plans, credits, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { formatNumber, formatCurrency, daysUntil, translations } from "@/lib/utils";
import { CreditCard, Clock, Sparkles, ArrowUpRight } from "lucide-react";

export default async function UserDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Get user's subscription
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);

  let planName = "پلن رایگان";
  let planCredits = 0;
  let planPrice = 0;

  if (subscription && subscription.status === "active") {
    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, subscription.planId))
      .limit(1);
    if (plan) {
      planName = plan.nameFa;
      planCredits = plan.credits;
      planPrice = plan.price;
    }
  }

  // Get user's credit balance
  const [lastCredit] = await db
    .select()
    .from(credits)
    .where(eq(credits.userId, user.id))
    .orderBy(desc(credits.createdAt))
    .limit(1);

  const creditBalance = lastCredit?.balance || 0;
  const daysLeft = subscription?.endDate ? daysUntil(subscription.endDate) : 0;

  const stats = [
    {
      label: translations.currentPlan,
      value: planName,
      icon: CreditCard,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
    },
    {
      label: translations.remainingCredits,
      value: formatNumber(creditBalance),
      icon: Sparkles,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      label: translations.daysUntilRenewal,
      value: subscription ? formatNumber(daysLeft) : "-",
      icon: Clock,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          {translations.dashboard}
        </h1>
        <p className="text-slate-400 mt-1">خوش آمدید، {user.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
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

      {/* Current Plan Card */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              پلن فعلی شما
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              اطلاعات اشتراک شما
            </p>
          </div>
          {subscription?.status === "active" && (
            <a href="/user/plan" className="btn btn-secondary flex items-center gap-2">
              ارتقا پلن
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">پلن</p>
            <p className="text-xl font-semibold text-slate-100">{planName}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">قیمت ماهانه</p>
            <p className="text-xl font-semibold text-slate-100">
              {planPrice > 0 ? formatCurrency(planPrice) : "رایگان"}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">اعتبار باقی‌مانده</p>
            <p className="text-xl font-semibold text-slate-100">
              {formatNumber(creditBalance)} پروژه
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/user/plan"
          className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <CreditCard className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <p className="font-medium text-slate-200">مدیریت پلن</p>
            <p className="text-sm text-slate-400">مشاهده و تغییر پلن اشتراکی</p>
          </div>
        </a>
        <a
          href="/user/services"
          className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="font-medium text-slate-200">خدمات اضافی</p>
            <p className="text-sm text-slate-400">خرید اعتبار بیشتر</p>
          </div>
        </a>
      </div>
    </div>
  );
}
