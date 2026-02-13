import { db } from "@/db";
import { subscriptions, plans, credits } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { formatNumber, formatCurrency, daysUntil, translations } from "@/lib/utils";
import { Check, Sparkles, Crown } from "lucide-react";

export default async function UserPlanPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Get current subscription
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);

  let currentPlanId = null;
  if (subscription && subscription.status === "active") {
    currentPlanId = subscription.planId;
  }

  // Get all available plans
  const allPlans = await db
    .select()
    .from(plans)
    .where(eq(plans.isActive, true))
    .orderBy(plans.price);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          {translations.myPlan}
        </h1>
        <p className="text-slate-400 mt-1">
          مدیریت پلن اشتراکی شما
        </p>
      </div>

      {/* Current Plan */}
      {subscription && subscription.status === "active" && (
        <div className="card border-indigo-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-amber-400" />
            <h2 className="text-lg font-semibold text-slate-100">
              پلن فعلی شما
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-400">پلن</p>
              <p className="text-lg font-medium text-slate-100">
                {allPlans.find((p) => p.id === currentPlanId)?.nameFa || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">تاریخ تمدید</p>
              <p className="text-lg font-medium text-slate-100">
                {subscription.endDate
                  ? daysUntil(subscription.endDate) > 0
                    ? `${daysUntil(subscription.endDate)} روز دیگر`
                    : "امروز تمدید می‌شود"
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">وضعیت</p>
              <span className="badge badge-success">فعال</span>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div>
        <h2 className="text-xl font-semibold text-slate-100 mb-6">
          پلن‌های موجود
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allPlans.map((plan, index) => {
            const isCurrentPlan = plan.id === currentPlanId;
            return (
              <div
                key={plan.id}
                className={`card relative animate-fade-in stagger-${index + 1} ${
                  plan.isFeatured ? "border-indigo-500/50" : ""
                } ${isCurrentPlan ? "ring-2 ring-indigo-500" : ""}`}
              >
                {plan.isFeatured && (
                  <div className="absolute -top-3 right-4 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full">
                    {translations.featured}
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-4 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full">
                    فعلی
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-100">
                    {plan.nameFa}
                  </h3>
                  <p className="text-sm text-slate-400">{plan.name}</p>
                </div>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-slate-100">
                    {formatNumber(Math.floor(plan.price))}
                  </span>
                  <span className="text-slate-400"> تومان</span>
                  <span className="text-sm text-slate-500">/ماهانه</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <span className="text-slate-300">
                      {formatNumber(plan.credits)} پروژه
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-slate-300">پشتیبانی优先</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span className="text-slate-300">فضای ابری نامحدود</span>
                  </div>
                </div>
                {isCurrentPlan ? (
                  <button className="btn btn-secondary w-full" disabled>
                    پلن فعلی
                  </button>
                ) : (
                  <button className="btn btn-primary w-full">
                    {plan.price > (allPlans.find((p) => p.id === currentPlanId)?.price || 0)
                      ? translations.upgrade
                      : translations.downgrade}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
