import type { Metadata } from "next";
import AdminDashboard from "./AdminDashboard";
import { requireChatGPTUser } from "../chatgpt-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Natpe Thunai Crackers store administration dashboard.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");

  return (
    <AdminDashboard
      user={{
        name: user.fullName ?? "Store Admin",
        email: user.email,
      }}
    />
  );
}
