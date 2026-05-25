export const ADMIN_SESSION_COOKIE_NAME = "pingnode_admin_session";

const FALLBACK_ADMIN_USERNAME = "admin";
const FALLBACK_ADMIN_PASSWORD = "admin123";

export function getAdminUsername() {
  return process.env.ADMIN_USERNAME?.trim() || FALLBACK_ADMIN_USERNAME;
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || FALLBACK_ADMIN_PASSWORD;
}

export function getAdminSessionValue() {
  const sessionSecret =
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    `${getAdminUsername()}:${getAdminPassword()}:pingnode-admin`;

  return `pingnode-admin:${sessionSecret}`;
}

export function isValidAdminCredentials(username: string, password: string) {
  return (
    username.trim() === getAdminUsername() &&
    password.trim() === getAdminPassword()
  );
}
