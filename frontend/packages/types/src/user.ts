/**
 * User and auth types — DTOs, requests, and responses
 */
import type { UserRole } from './common';

// --- User DTO ---

export interface UserDTO {
  id: number | null;
  username: string;
  email: string;
  displayName: string | null;
  avatar: string | null;
  bio: string | null;
  role: UserRole;
  isEnabled: boolean;
  createdAt: string | null;
}

// --- User mutation ---

export interface UserRequest {
  username: string;
  email: string;
  password: string | null;
  displayName: string | null;
  bio: string | null;
  avatar: string | null;
  role: UserRole;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

// --- Auth ---

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string | null;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

export interface RegisterResponse {
  message: string;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: UserDTO;
}