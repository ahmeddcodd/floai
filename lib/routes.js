export const HOME_PATH = "/";
export const SETUP_PATH = "/setup";
export const DASHBOARD_PATH = "/dashboard";
export const AUTH_CALLBACK_PATH = "/auth/callback";

export function buildDashboardPath(merchantId) {
  if (!merchantId) {
    return DASHBOARD_PATH;
  }

  return `${DASHBOARD_PATH}?merchant_id=${encodeURIComponent(merchantId)}`;
}
