export const ROUTES = {
  PUBLIC: {
    LOGIN: "/",
  },
  AUTH: {
    DASHBOARD: "/dashboard",
    MASTER: {
      USERS: "/dashboard/users",
    },
    ACCOUNT: "/dashboard/account",
  },
};

export const DEFAULT_API_URL = "/api";
export const PUBLIC_API_URL = "/api/notifications";
export const DEFAULT_AUTH = "/api/auth";
export const PUBLIC_ROUTES = [ROUTES.PUBLIC.LOGIN];

export const LABEL = {
  INPUT: {
    SUCCESS: {
      SAVED: "Saved successfully.",
      UPDATE: "Updated successfully.",
      DELETE: "Deleted successfully.",
    },
    FAILED: {
      SAVED: "Couldn’t save data.",
      UPDATE: "Couldn’t update data.",
      DELETE: "Couldn’t delete data.",
    },
  },
  ERROR: {
    INVALID_FIELD: "Invalid input. Please check your data.",
    DESCRIPTION: "We’re having some connection issues. Try again shortly.",
    SERVER: "Something went wrong on our server. Please try again later.",
    NOT_LOGIN: "You need to sign in to continue.",
    NOT_ID_USER: "Access denied. Invalid member ID.",
    UNAUTHORIZED: "You’re not authorized to perform this action.",
  },
};

// TAGS VALIDATION
export const tagsUserRevalidate = ["get-account"];
