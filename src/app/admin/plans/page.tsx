import { db } from "@/db";
import { plans } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatCurrency, formatNumber, translations } from "@/lib/utils";
import { Plus, Star, MoreVertical, Edit, Trash2 } from "lucide-react";

async function getPlans() {
  return db.select().from(plans).orderBy(desc(plans.isFeatured), desc(plans.price));
}

export default function PlansPage() {
  // This would be a server component but for demo we'll use a client wrapper
  return <PlansList />;
}

async function PlansList() {
  const plansList = await getPlans();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            {translations.plans}
          </h1>
          <p className="text-slate-400 mt-1">
            مدیریت پلن‌های اشتراکی
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2 self-start">
          <Plus className="w-4 h-4" />
          {translations.addPlan}
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plansList.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            <p>{translations.noData}</p>
            <button className="btn btn-primary mt-4">
              {translations.addPlan}
            </button>
          </div>
        ) : (
          plansList.map((plan, index) => (
            <div
              key={plan.id}
              className={`card relative overflow-hidden animate-fade-in stagger-${index + 1} ${
                plan.isFeatured ? "border-indigo-500/50" : ""
              }`}
            >
              {plan.isFeatured && (
                <div className="absolute top-0 left-0 bg-indigo-500 text-white text-xs px-3 py-1">
                  {translations.featured}
                </div>
              )}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">
                    {plan.nameFa}
                  </h3>
                  <p className="text-sm text-slate-400">{plan.name}</p>
                </div>
                {plan.isFeatured && (
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                )}
              </div>
              <p className="text-sm text-slate-400 mb-4">
                {plan.descriptionFa || plan.description || "توضیحاتی ثبت نشده"}
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-slate-100">
                  {formatNumber(Math.floor(plan.price))}
                </span>
                <span className="text-slate-400">تومان</span>
                <span className="text-sm text-slate-500">/ماهانه</span>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">اعتبار</span>
                  <span className="font-semibold text-slate-200">
                    {formatNumber(plan.credits)} پروژه
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-secondary flex-1 flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  ویرایش
                </button>
                <button className="btn btn-secondary p-2">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              {!plan.isActive && (
                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                  <span className="badge badge-error">غیرفعال</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
