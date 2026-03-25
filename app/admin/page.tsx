import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_token")?.value === process.env.ADMIN_SECRET;
  if (isAdmin) redirect("/admin/dashboard");
  else redirect("/admin/login");
}
