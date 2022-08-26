export interface User {
  displayName: string;
  email?: string | null;
  password?: string;
  photoURL?: string;
  emailVarified?: boolean;
  uid?: string;
}
