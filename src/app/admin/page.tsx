import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";
import AdminEditor from "@/components/admin/AdminEditor";

export const instant = false;

export default async function AdminPage() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    redirect("/admin/login");
  }

  return <AdminEditor />;
}
