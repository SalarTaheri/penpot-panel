import { db } from "@/db";
import { services } from "@/db/schema";
import { formatCurrency, formatNumber, translations } from "@/lib/utils";
import { Plus, MoreVertical, Edit } from "lucide-react";

async function getServices() {
  return db.select().from(services);
}

export default async function ServicesPage() {
  const servicesList = await getServices();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            {translations.services}
          </h1>
          <p className="text-slate-400 mt-1">
            مدیریت خدمات اضافی
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2 self-start">
          <Plus className="w-4 h-4" />
          افزودن خدمات
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesList.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            <p>{translations.noData}</p>
            <button className="btn btn-primary mt-4">
              افزودن خدمات
            </button>
          </div>
        ) : (
          servicesList.map((service, index) => (
            <div
              key={service.id}
              className={`card animate-fade-in stagger-${index + 1}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">
                    {service.nameFa}
                  </h3>
                  <p className="text-sm text-slate-400">{service.name}</p>
                </div>
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                {service.descriptionFa || service.description || "توضیحاتی ثبت نشده"}
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
                  <span className="font-semibold text-slate-200">
                    +{formatNumber(service.credits)} پروژه
                  </span>
                </div>
              </div>
              <button className="btn btn-secondary w-full flex items-center justify-center gap-2">
                <Edit className="w-4 h-4" />
                ویرایش
              </button>
              {!service.isActive && (
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
