export type UserRole = "student" | "recruiter";

export interface Resume {
  url: string;
  publicId?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  resume?: Resume;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  token: string;
}