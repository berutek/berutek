export interface User {
  id: string;
  username: string;
  email: string;
  displayname: string;
  groups: string[];
}

export const ADMIN_GROUP = "admin";
