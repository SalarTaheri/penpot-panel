// Persian translations
export const translations = {
  // Navigation
  dashboard: "داشبورد",
  users: "کاربران",
  plans: "پلن‌ها",
  payments: "پرداخت‌ها",
  myPlan: "پلن من",
  billing: "صورتحساب",
  services: "خدمات",
  logout: "خروج",
  login: "ورود",

  // Dashboard
  totalUsers: "کل کاربران",
  activeSubscriptions: "اشتراک‌های فعال",
  monthlyRevenue: "درآمد ماهانه",
  recentActivity: "فعالیت‌های اخیر",

  // User Management
  addUser: "افزودن کاربر",
  editUser: "ویرایش کاربر",
  deleteUser: "حذف کاربر",
  userName: "نام",
  email: "ایمیل",
  role: "نقش",
  admin: "مدیر",
  user: "کاربر",
  active: "فعال",
  inactive: "غیرفعال",

  // Plans
  planName: "نام پلن",
  planPrice: "قیمت ماهانه",
  planCredits: "اعتبار",
  featured: "ویژه",
  addPlan: "افزودن پلن",

  // Billing
  currentPlan: "پلن فعلی",
  remainingCredits: "اعتبار باقی‌مانده",
  daysUntilRenewal: "روز تا تمدید",
  upgrade: "ارتقا",
  downgrade: "کاهش",
  paymentHistory: "تاریخچه پرداخت",

  // Status
  pending: "در انتظار",
  completed: "تکمیل شده",
  failed: "ناموفق",
  cancelled: "لغو شده",
  expired: "منقضی",

  // Actions
  save: "ذخیره",
  cancel: "لغو",
  confirm: "تایید",
  search: "جستجو",
  filter: "فیلتر",
  export: "صدور",
  download: "دانلود",

  // Messages
  success: "عملیات موفق",
  error: "خطا",
  loading: "در حال بارگذاری...",
  noData: "داده‌ای یافت نشد",
  confirmDelete: "آیا از حذف این مورد اطمینان دارید؟",

  // Auth
  password: "رمز عبور",
  confirmPassword: "تأیید رمز عبور",
  invalidCredentials: "نام کاربری یا رمز عبور اشتباه است",
  welcomeBack: "خوش آمدید",
};

// Format number to Persian
export function formatNumber(num: number | string): string {
  const numStr = typeof num === "number" ? num.toString() : num;
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return numStr
    .replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

// Format currency (Iranian Rial)
export function formatCurrency(amount: number): string {
  return formatNumber(amount.toLocaleString()) + " تومان";
}

// Format date to Persian
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const persianMonths = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];
  
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  
  return `${formatNumber(day)} ${persianMonths[month]} ${formatNumber(year)}`;
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "الان";
  if (diffMins < 60) return `${formatNumber(diffMins)} دقیقه پیش`;
  if (diffHours < 24) return `${formatNumber(diffHours)} ساعت پیش`;
  if (diffDays < 7) return `${formatNumber(diffDays)} روز پیش`;
  return formatDate(d);
}

// Calculate days until a date
export function daysUntil(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  return Math.ceil(diffMs / 86400000);
}

// Get plan status color
export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "text-emerald-400";
    case "pending":
      return "text-amber-400";
    case "expired":
    case "failed":
    case "cancelled":
      return "text-red-400";
    default:
      return "text-slate-400";
  }
}

// Get plan status background
export function getStatusBg(status: string): string {
  switch (status) {
    case "active":
      return "bg-emerald-500/10";
    case "pending":
      return "bg-amber-500/10";
    case "expired":
    case "failed":
    case "cancelled":
      return "bg-red-500/10";
    default:
      return "bg-slate-500/10";
  }
}
