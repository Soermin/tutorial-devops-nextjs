import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE_NAME,
  getAdminSessionValue,
  isValidAdminCredentials,
} from "@/lib/admin-auth-shared";

function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  };
}

export { ADMIN_SESSION_COOKIE_NAME, isValidAdminCredentials };

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  return (
    cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value ===
    getAdminSessionValue()
  );
}

export async function requireAdminSession() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function createAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(
    ADMIN_SESSION_COOKIE_NAME,
    getAdminSessionValue(),
    getAdminSessionCookieOptions(),
  );
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, "", {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  });
}
