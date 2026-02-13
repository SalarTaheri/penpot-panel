import { db } from "./index";
import { users, plans, services } from "./schema";
import { hashPassword } from "@/lib/auth";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await hashPassword("admin123");
  await db.insert(users).values({
    email: "admin@penpot.ir",
    password: hashedPassword,
    name: "مدیر سیستم",
    role: "admin",
    isActive: true,
  });
  console.log("✅ Admin user created");

  // Create test user
  const userPassword = await hashPassword("user123");
  const [user] = await db
    .insert(users)
    .values({
      email: "user@penpot.ir",
      password: userPassword,
      name: "کاربر تست",
      role: "user",
      isActive: true,
    })
    .returning();
  console.log("✅ Test user created");

  // Create plans
  const plansData = [
    {
      name: "Free",
      nameFa: "رایگان",
      description: "Free plan for testing",
      descriptionFa: "پلن رایگان برای تست",
      price: 0,
      credits: 1,
      isActive: true,
      isFeatured: false,
    },
    {
      name: "Basic",
      nameFa: "پایه",
      description: "Basic plan for individuals",
      descriptionFa: "پلن پایه برای افراد",
      price: 99000,
      credits: 5,
      isActive: true,
      isFeatured: false,
    },
    {
      name: "Pro",
      nameFa: "حرفه‌ای",
      description: "Pro plan for teams",
      descriptionFa: "پلن حرفه‌ای برای تیم‌ها",
      price: 299000,
      credits: 20,
      isActive: true,
      isFeatured: true,
    },
    {
      name: "Enterprise",
      nameFa: "سازمانی",
      description: "Enterprise plan for large teams",
      descriptionFa: "پلن سازمانی برای تیم‌های بزرگ",
      price: 990000,
      credits: 100,
      isActive: true,
      isFeatured: false,
    },
  ];

  for (const plan of plansData) {
    await db.insert(plans).values(plan);
  }
  console.log("✅ Plans created");

  // Create services
  const servicesData = [
    {
      name: "Extra Projects",
      nameFa: "پروژه اضافی",
      description: "Additional project credits",
      descriptionFa: "اعتبار پروژه اضافی",
      price: 20000,
      credits: 1,
      isActive: true,
    },
    {
      name: "Priority Support",
      nameFa: "پشتیبانی اولویت‌دار",
      description: "Get priority support",
      descriptionFa: "دریافت پشتیبانی با اولویت بالا",
      price: 50000,
      credits: 0,
      isActive: true,
    },
    {
      name: "Extra Storage",
      nameFa: "فضای ابری اضافی",
      description: "Additional cloud storage",
      descriptionFa: "فضای ابری اضافی",
      price: 30000,
      credits: 5,
      isActive: true,
    },
  ];

  for (const service of servicesData) {
    await db.insert(services).values(service);
  }
  console.log("✅ Services created");

  console.log("🎉 Seeding completed!");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
