import type { NavElement } from "./contstants";

export const canViewElement = (
  element: NavElement,
  userRole: "admin" | "user" | null
) => {
  
  switch (element.requiredRole) {
    case "admin":
      return userRole === "admin";
    case "user":
      return userRole === "user" || userRole ==="admin";
    case "userOnly":
      return userRole === "user"
    case "all":
      return true;
    case null:
      return userRole === null;
    default:
      return false;
  }
};