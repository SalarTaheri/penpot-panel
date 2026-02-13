import { db } from "@/db";
import { payments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { formatCurrency, formatDate, translations } from "@/lib/utils";
import { Receipt, Download, CreditCard } from "lucide-react";

export default async function UserBillingPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Get user's payments
  const userPayments = await db
    .select()
    .from(payments)
    .where(eq(payments.userId, user.id))
    .orderBy(desc(payments.createdAt));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "failed":
        return "badge-error";
      case "refunded":
        return "badge-info";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "تکمیل شده";
      case "pending":
        return "در انتظار";
      case "failed":
        return "ناموفق";
      case "refunded":
        return "برگشت";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          {translations.billing}
        </h1>
        <p className="text-slate-400 mt-1">
          تاریخچه پرداخت‌ها و صورتحساب‌ها
        </p>
      </div>

      {/* Payment Method */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            روش پرداخت
          </h2>
          <button className="btn btn-secondary text-sm">
            افزودن کارت
          </button>
        </div>
        <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
          <div className="p-3 bg-indigo-500/10 rounded-lg">
            <CreditCard className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-200">
              **** **** **** 1234
            </p>
            <p className="text-sm text-slate-400">کارت بانک ملت</p>
          </div>
          <button className="text-sm text-slate-400 hover:text-slate-200">
            ویرایش
          </button>
        </div>
      </div>

      {/* Payment History */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          {translations.paymentHistory}
        </h2>
        
        {userPayments.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{translations.noData}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <Receipt className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">
                      {payment.description || "پرداخت اشتراک"}
                    </p>
                    <p className="text-sm text-slate-400">
                      {formatDate(payment.createdAt || new Date())}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <p className="font-semibold text-slate-200">
                      {formatCurrency(payment.amount)}
                    </p>
                    <span className={`badge ${getStatusBadge(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </span>
                  </div>
                  <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
