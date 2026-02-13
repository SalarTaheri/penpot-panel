import { db } from "@/db";
import { users, subscriptions, plans } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatDate, translations } from "@/lib/utils";
import { UserPlus, Search, MoreVertical, Mail } from "lucide-react";

async function getUsers() {
  const allUsers = await db
    .select()
    .from(users)
    .orderBy(desc(users.createdAt));

  // Get subscription info for each user
  const usersWithSubs = await Promise.all(
    allUsers.map(async (user) => {
      const [sub] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, user.id));
      
      let planName = "-";
      if (sub) {
        const [plan] = await db
          .select()
          .from(plans)
          .where(eq(plans.id, sub.planId))
          .limit(1);
        planName = plan?.nameFa || "-";
      }

      return { ...user, planName, subscriptionStatus: sub?.status || null };
    })
  );

  return usersWithSubs;
}

export default async function UsersPage() {
  const usersList = await getUsers();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            {translations.users}
          </h1>
          <p className="text-slate-400 mt-1">
            مدیریت کاربران سیستم
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2 self-start">
          <UserPlus className="w-4 h-4" />
          {translations.addUser}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="جستجو در کاربران..."
          className="input pr-11"
        />
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>{translations.userName}</th>
              <th>{translations.email}</th>
              <th>پلن فعلی</th>
              <th>وضعیت اشتراک</th>
              <th>نقش</th>
              <th>تاریخ ثبت</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {usersList.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400">
                  {translations.noData}
                </td>
              </tr>
            ) : (
              usersList.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center">
                        <span className="text-indigo-400 text-sm font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-slate-200">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-4 h-4 text-slate-500" />
                      {user.email}
                    </div>
                  </td>
                  <td className="text-slate-300">{user.planName}</td>
                  <td>
                    {user.subscriptionStatus ? (
                      <span
                        className={`badge ${
                          user.subscriptionStatus === "active"
                            ? "badge-success"
                            : user.subscriptionStatus === "pending"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {user.subscriptionStatus === "active"
                          ? "فعال"
                          : user.subscriptionStatus === "pending"
                          ? "در انتظار"
                          : "غیرفعال"}
                      </span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        user.role === "admin" ? "badge-info" : "badge-success"
                      }`}
                    >
                      {user.role === "admin"
                        ? translations.admin
                        : translations.user}
                    </span>
                  </td>
                  <td className="text-slate-400">
                    {formatDate(user.createdAt || new Date())}
                  </td>
                  <td>
                    <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
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
          نمایش {usersList.length} کاربر
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
