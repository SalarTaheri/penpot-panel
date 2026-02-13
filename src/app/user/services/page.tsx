import { db } from "@/db";
import { services, userServices } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { Sparkles, Plus, Check } from "lucide-react";

export default async function UserServicesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Get user's active services
  const userActiveServices = await db
    .select()
    .from(userServices)
    .where(
      and(
        eq(userServices.userId, user.id),
        eq(userServices.status, "active")
      )
    );

  // Get all available services
  const allServices = await db
    .select()
    .from(services)
    .where(eq(services.isActive, true));

  const activeServiceIds = userActiveServices.map((us) => us.serviceId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          خدمات اضافی
        </h1>
        <p className="text-slate-400 mt-1">
          خرید اعتبار و امکانات بیشتر
        </p>
      </div>

      {/* Active Services */}
      {userActiveServices.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">
            خدمات فعال شما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userActiveServices.map((us) => {
              const service = allServices.find((s) => s.id === us.serviceId);
              if (!service) return null;
              return (
                <div
                  key={us.id}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Check className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">
                        {service.nameFa}
                      </p>
                      <p className="text-sm text-slate-400">
                        تا {new Date(us.endDate).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                  </div>
                  <span className="badge badge-success">فعال</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Services */}
      <div>
        <h2 className="text-xl font-semibold text-slate-100 mb-6">
          خدمات موجود
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allServices.map((service, index) => {
            const isActive = activeServiceIds.includes(service.id);
            return (
              <div
                key={service.id}
                className={`card animate-fade-in stagger-${index + 1} ${
                  isActive ? "border-emerald-500/30" : ""
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">
                      {service.nameFa}
                    </h3>
                    <p className="text-sm text-slate-400">{service.name}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-4">
                  {service.descriptionFa || service.description || "اعتبار اضافی برای پروژه‌های بیشتر"}
                </p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-slate-100">
                    {formatNumber(Math.floor(service.price))}
                  </span>
                  <span className="text-slate-400">تومان</span>
                  <span className="text-sm text-slate-500">/ماهانه</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">اعتبار اضافی</span>
                    <span className="font-semibold text-amber-400">
                      +{formatNumber(service.credits)} پروژه
                    </span>
                  </div>
                </div>
                {isActive ? (
                  <button className="btn btn-secondary w-full flex items-center justify-center gap-2" disabled>
                    <Check className="w-4 h-4" />
                    خریداری شده
                  </button>
                ) : (
                  <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    خرید
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
