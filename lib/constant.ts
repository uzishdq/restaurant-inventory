export const ROUTES = {
  PUBLIC: {
    LOGIN: "/",
  },
  AUTH: {
    DASHBOARD: "/dashboard",
    MASTER: {
      USERS: "/dashboard/users",
    },
  },
};

export const DEFAULT_API_URL = "/api";
export const PUBLIC_API_URL = "/api/notifications";
export const DEFAULT_AUTH = "/api/auth";
export const PUBLIC_ROUTES = [ROUTES.PUBLIC.LOGIN];
