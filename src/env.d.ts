import { USER_ROLES } from "./lib/constants";

declare global {
  namespace App {
    interface Locals {
      user: {
        id: string;
        email: string;
        name: string;
        role: typeof USER_ROLES[number];
      } | null;
    }
  }
}