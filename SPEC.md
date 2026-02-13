# Penpot User Management Panel - Specification

## 1. Project Overview

**Project Name:** Penpot User Management Panel (پنل مدیریت کاربران پن‌پات)

**Type:** Web Application (Next.js 16 + React 19)

**Core Functionality:** A self-hosted Persian web panel for managing Penpot users with subscription plans, payment tracking, and credit management.

**Target Users:**
- **Admins:** Server administrators managing Penpot installations
- **End Users:** Designers using Penpot who need to manage their paid plans

---

## 2. UI/UX Specification

### 2.1 Layout Structure

**Overall Layout:**
- Sidebar navigation (RTL - right side for Persian)
- Main content area with header
- Responsive: collapsible sidebar on mobile

**Page Sections:**
- **Header:** Logo, user profile dropdown, notifications
- **Sidebar:** Navigation links with icons
- **Content:** Page-specific content with breadcrumbs

**Responsive Breakpoints:**
- Mobile: < 768px (sidebar hidden, hamburger menu)
- Tablet: 768px - 1024px (collapsed sidebar)
- Desktop: > 1024px (full sidebar)

### 2.2 Visual Design

**Color Palette:**
- Primary: `#6366F1` (Indigo-500) - Main actions, active states
- Secondary: `#1E1B4B` (Indigo-950) - Sidebar background
- Accent: `#F59E0B` (Amber-500) - Warnings, highlights
- Success: `#10B981` (Emerald-500) - Positive states
- Error: `#EF4444` (Red-500) - Errors, destructive actions
- Background: `#0F0F1A` - Main dark background
- Surface: `#1A1A2E` - Cards, elevated surfaces
- Text Primary: `#F8FAFC` (Slate-50)
- Text Secondary: `#94A3B8` (Slate-400)
- Border: `#334155` (Slate-700)

**Typography:**
- Font Family: `Vazirmatn` (Persian) + `JetBrains Mono` (English/numbers)
- Headings: 
  - H1: 32px, Bold (700)
  - H2: 24px, SemiBold (600)
  - H3: 20px, SemiBold (600)
  - H4: 16px, Medium (500)
- Body: 14px, Regular (400)
- Small: 12px, Regular (400)

**Spacing System:**
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Card padding: 24px
- Section gap: 32px

**Visual Effects:**
- Card shadows: `0 4px 6px -1px rgba(0, 0, 0, 0.3)`
- Border radius: 8px (cards), 6px (buttons), 4px (inputs)
- Transitions: 200ms ease-in-out
- Hover states: subtle brightness increase (+5%)
- Glassmorphism on sidebar: `backdrop-blur-xl bg-opacity-80`

### 2.3 Components

**Buttons:**
- Primary: Indigo background, white text
- Secondary: Transparent, border, white text
- Danger: Red background for destructive actions
- States: hover (brightness), active (scale 0.98), disabled (opacity 0.5)

**Cards:**
- Background: Surface color (`#1A1A2E`)
- Border: 1px solid border color
- Border radius: 8px
- Padding: 24px

**Forms:**
- Input fields: Dark background, border, focus ring
- Labels: Text secondary, 12px, uppercase
- Error states: Red border, error message below

**Tables:**
- Header: Surface color background
- Rows: Alternating subtle colors
- Hover: Slight highlight
- Pagination: Bottom right

**Sidebar Navigation:**
- Items: Icon + Label
- Active: Primary color highlight, left border indicator
- Hover: Subtle background change
- Icons: Lucide React icons

---

## 3. Functionality Specification

### 3.1 Core Features

**Authentication:**
- Login page with email/password
- Session management with cookies
- Role-based access (admin/user)
- Logout functionality

**Admin Panel:**
1. **Dashboard**
   - Total users count
   - Active subscriptions
   - Monthly revenue
   - Recent activity

2. **User Management**
   - List all users with search/filter
   - Add new user (email, name, initial plan)
   - Edit user details
   - Delete user (soft delete)
   - View user activity log
   - Reset user password

3. **Plan Management**
   - Create plans (name, monthly price, credits)
   - Edit existing plans
   - Archive plans
   - Assign plans to users

4. **Payment History**
   - View all transactions
   - Filter by date, user, status
   - Export to CSV

**User Panel:**
1. **Dashboard**
   - Current plan info
   - Remaining credits
   - Days until renewal
   - Quick upgrade button

2. **My Plan**
   - Current plan details
   - Usage history
   - Upgrade/downgrade options

3. **Payment Methods**
   - Add payment method (card info)
   - Remove payment method
   - Set default

4. **Billing History**
   - List of all invoices
   - Download invoice PDF

5. **Services**
   - View available add-on services
   - Purchase additional services

### 3.2 User Interactions & Flows

**Admin User Flow:**
1. Login → Dashboard
2. View stats → Click user → Manage user
3. Create user → Fill form → Submit → Success message

**End User Flow:**
1. Login → Dashboard
2. View current plan → Click upgrade → Select plan → Payment → Confirmed

### 3.3 Data Handling

**Database:** SQLite with Drizzle ORM

**Tables:**
- `users` - User accounts
- `plans` - Subscription plans
- `subscriptions` - Active subscriptions
- `payments` - Payment records
- `credits` - Credit balance history
- `services` - Additional services

### 3.4 Edge Cases

- Expired subscription: Grace period, then downgrade
- Insufficient credits: Warning, block new projects
- Payment failure: Retry logic, notify user
- Concurrent edits: Optimistic locking

---

## 4. Acceptance Criteria

### 4.1 Success Conditions

1. ✅ Admin can create, edit, delete users
2. ✅ Admin can manage subscription plans
3. ✅ Users can view their current plan and credits
4. ✅ Users can upgrade/downgrade plans
5. ✅ Payment system tracks all transactions
6. ✅ Full Persian RTL interface
7. ✅ Responsive on all devices
8. ✅ Dark theme consistent throughout

### 4.2 Visual Checkpoints

- [ ] Login page renders in Persian with RTL
- [ ] Dashboard shows all stats cards
- [ ] User list table with pagination works
- [ ] Forms validate and show errors
- [ ] Sidebar navigation works
- [ ] Mobile responsive layout

---

## 5. Technical Implementation

### 5.1 Dependencies

```json
{
  "dependencies": {
    "next": "^16.1.3",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "drizzle-orm": "^0.39.0",
    "better-sqlite3": "^11.7.0",
    "zod": "^3.24.0",
    "lucide-react": "^0.468.0",
    "jose": "^6.0.0",
    "bcryptjs": "^2.4.3"
  }
}
```

### 5.2 File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Redirect to /login
│   ├── globals.css             # Global styles + RTL
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   ├── page.tsx            # Dashboard
│   │   ├── users/
│   │   │   └── page.tsx        # User management
│   │   └── plans/
│   │       └── page.tsx        # Plan management
│   └── user/
│       ├── layout.tsx          # User layout with sidebar
│       ├── page.tsx            # User dashboard
│       ├── plan/
│       │   └── page.tsx        # My plan
│       └── billing/
│           └── page.tsx        # Billing history
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── admin/                  # Admin-specific components
│   └── user/                   # User-specific components
├── lib/
│   ├── db/                     # Database setup
│   │   ├── schema.ts           # Table definitions
│   │   └── index.ts            # DB instance
│   ├── auth.ts                 # Authentication utilities
│   └── utils.ts                # Helper functions
└── types/                      # TypeScript types
```
