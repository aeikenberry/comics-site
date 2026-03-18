import { SessionOptions } from "iron-session";

export interface SessionData {
  isAdmin?: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "comics-admin-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
