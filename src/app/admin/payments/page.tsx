import { db } from "@/db";
import { payments, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatCurrency, formatDate, translations } from "@/lib/utils";
import { Search, Download, Filter } from "lucide-react";

async function getPayments() {
  const allPayments = await db
    .select()
    .from(payments)
    .orderBy(desc(payments.createdAt))
    .limit(50);

  // Get user info for each payment
  const paymentsWithUsers = await Promise.all(
    allPayments.map(async (payment) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payment.userId))
        .limit(1);
      return { ...payment, userName: user?.name || "Unknown" };
    })
  );

  return paymentsWithUsers;
}

export default async function PaymentsPage() {
  const paymentsList = await getPayments();

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            {translations.payments}
          </h1>
          <p className="text-slate-400 mt-1">
            تاریخچه تراکنش‌های پرداخت
          </p>
        </div>
        <button className="btn btn-secondary flex items-center gap-2 self-start">
          <Download className="w-4 h-4" />
          {translations.export}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="جستجو..."
            className="input pr-11"
          />
        </div>
        <button className="btn btn-secondary flex items-center gap-2">
          <Filter className="w-4 h-4" />
          {translations.filter}
        </button>
      </div>

      {/* Payments Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>کاربر</th>
              <th>مبلغ</th>
              <th>وضعیت</th>
              <th>روش پرداخت</th>
              <th>تاریخ</th>
              <th>توضیحات</th>
            </tr>
          </thead>
          <tbody>
            {paymentsList.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  {translations.noData}
                </td>
              </tr>
            ) : (
              paymentsList.map((payment) => (
                <tr key={payment.id}>
                  <td className="font-medium text-slate-200">
                    {payment.userName}
                  </td>
                  <td className="font-semibold text-slate-200">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </span>
                  </td>
                  <td className="text-slate-300">
                    {payment.paymentMethod || "-"}
                  </td>
                  <td className="text-slate-400">
                    {formatDate(payment.createdAt || new Date())}
                  </td>
                  <td className="text-slate-400 text-sm">
                    {payment.description || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          نمایش {paymentsList.length} تراکنش
        </p>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary text-sm" disabled>
            قبلی
          </button>
          <button className="btn btn-secondary text-sm" disabled>
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}
