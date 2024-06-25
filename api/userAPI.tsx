"use server";
import { jwtVerify } from "jose";
import { User, UserLogin } from "@/types";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY);

const userAPI = axios.create({
  baseURL: API_URL,
});

//get user

export const getUser = async (username: string) => {
  try {
    const res = await userAPI.get(`/user/${username}`);
    if (res.data["status_code"] != 400) {
      return { status: 200, data: res.data };
    } else {
      return { status: 400, error: "The user does not exist" };
    }
  } catch (error) {
    console.log(error);
  }
  return { status: 400, error: "The user does not exist" };
};

export const addUser = async (user: User) => {
  try {
    const res = await userAPI.post("/user", user);
    if (res.data["status_code"] != 401) {
      cookies().set({
        name: COOKIE_NAME,
        value: res.data.result["token"],
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      return { status: 200 };
    } else {
      return { status: 401, error: "Error while registering user" };
    }
  } catch (error) {
    console.error("Error during register");
  }
  return { status: 401, error: "Error while registering user" };
};

export const updateUser = async (user: User) => {
  try {
    const res = await userAPI.put("/user", user);
    if (res.data["status_code"] != 401) {
      cookies().set({
        name: COOKIE_NAME,
        value: res.data.result["token"],
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      return { status: 200 };
    } else {
      return { status: 401, error: "Error while updating user" };
    }
  } catch (error) {
    console.error("Error during updating");
  }
  return { status: 401, error: "Error while updating user" };
};

export const auth = async (user: UserLogin) => {
  try {
    const data = await userAPI.post("/auth/signin", user);
    if (data.data["status_code"] != 401) {
      const token = data.data.result["token"];
      cookies().set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        sameSite: "strict",
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
  try {
    cookies().set({
      name: COOKIE_NAME,
      value: "",
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });
    return { status: 200 };
  } catch (error) {
    console.error("Error during authentication", error);
  }
  return { status: 404, error: "Invalid username or password" };
};

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get(COOKIE_NAME)?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.exp = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: COOKIE_NAME,
    value: session,
    httpOnly: true,
    expires: parsed.exp,
  });
  return res;
}
