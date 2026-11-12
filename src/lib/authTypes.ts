export interface QUser {
  id: string;
  name?: string;
  email?: string;
  roles?: string[];
  [key: string]: unknown;
}
