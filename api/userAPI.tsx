"use server";
import { SignJWT, jwtVerify } from "jose";
import { User, UserLogin } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY);

const userAPI = axios.create({
  baseURL: API_URL,
});

//get users

export const getUsers = async () => {
  const res = await userAPI.get("/user");
  return res.data;
};

export const addUser = async (user: User) => {
  userAPI.post("/user", user);
};

export const auth = async (user: UserLogin) => {
  try {
    const data = await userAPI.post("/auth/signin", user);
    if (data.data["status_code"] != 401) {
      const token = data.data.result["token"];
      cookies().set({
        name: "user",
        value: token,
        httpOnly: true,
        sameSite: "none",
        path: "/",
      });
      return { status: 200 };
    } else {
      return { status: 404, error: "Invalid username or password" };
    }
  } catch (error) {
    console.error("Error during authentication");
  }
  return { status: 404, error: "Invalid username or password" };
};

export const logout = () => {
  cookies().set({
    name: "user",
    value: "",
    httpOnly: true,
    sameSite: "none",
    path: "/",
  });
};

export const userMe = async (request: NextRequest) => {
  const session = request.cookies.get("user");
  if (!session) return null;
  return await session;
};

export const getSession = async () => {
  const token = {
    headers: {
      Authorization: "Bearer " + cookies().get("user")?.value,
    },
  };
  const data = await userAPI.get("/user/me", token);
  return data.data;
};

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("user")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.exp = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "user",
    value: session,
    httpOnly: true,
    expires: parsed.exp,
  });
  return res;
}
