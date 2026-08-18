export {};

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      username: string;
      email: string;
      displayname: string;
      groups: string[];
    };
    oidcState?: string;
  }
}
