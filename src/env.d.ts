import type { Role } from './db/schema';

declare global {
  namespace App {
    interface Locals {
      user: {
        id: string;
        email: string;
        name: string;
        role: Role;
      } | null;
    }
  }
}