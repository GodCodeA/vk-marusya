import { httpClient } from "./http";
import { User } from "../types/user";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  surname: string;
}

interface LoginResponse {
  result: boolean;
}

interface RegisterResponse {
  success: boolean;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await httpClient.post<LoginResponse>("/auth/login", payload);
  return response.data;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await httpClient.post<RegisterResponse>("/user", payload);
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await httpClient.get<User>("/profile");
  return response.data;
}

export async function logoutUser(): Promise<void> {
  await httpClient.get("/auth/logout");
}
