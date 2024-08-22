"use server";
import {
  ApiPromiseUser,
  AuthResponse,
  User,
  UserDetail,
  UserLogin,
} from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/constants";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY);

const userAPI = axios.create({
  baseURL: API_URL,
});

//get user
export const getUser = async (username: string): Promise<ApiPromiseUser> => {
  try {
    const res = await userAPI.get(`/user/${username}`);
    if (res.data.status_code != 404) {
      return { status: 200, data: res.data.result };
    } else {
      return { status: 400, error: "The user does not exist" };
    }
  } catch (error) {
    console.log(error);
    return { status: 400, error: "The user does not exist" };
  }
};

//add user
export const addUser = async (user: User): Promise<ApiPromiseUser> => {
  try {
    const res = await userAPI.post("/user", user);
    if (res.data.status_code != 400) {
      cookies().set({
        name: COOKIE_NAME,
        value: res.data.result["token"],
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60,
      });
      return { status: 200 };
    } else {
      return { status: 401, error: "Error while registering user" };
    }
  } catch (error) {
    console.error("Error while registering user", error);
    return { status: 401, error: "Error while registering user" };
  }
};

// update user
export const updateUser = async (
  username: string,
  user: UserDetail
): Promise<ApiPromiseUser> => {
  try {
    const res = await userAPI.put(`/user/${username}`, user);
    if (res.data.status_code != 400) {
      // auth the user with the new data
      const au_res = await auth({
        username: user.username,
        password: user.password,
      });
      if (au_res.status == 204 && au_res.token) {
        // update session with the new token
        updateSessionLocal(au_res.token);
        return { status: 200 };
      }
      return { status: 200 };
    } else {
      return {
        status: 401,
        error: `Error while updating user. Detail: ${res.data.detail}`,
      };
    }
  } catch (error) {
    console.error("Error during updating", error);
    return { status: 401, error: "Error while updating user" };
  }
};

// delete user
export const deleteUser = async (username: string): Promise<ApiPromiseUser> => {
  try {
    const res = await userAPI.delete(`/user/${username}`);
    // remove cookie
    if (res.data.status_code != 404) {
      cookies().set({
        name: COOKIE_NAME,
        value: "",
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      return { status: 200 };
    } else {
      return {
        status: 401,
        error: `Error while deleting user. Detail: ${res.data.detail}`,
      };
    }
  } catch (error) {
    console.error("Error while deleting user", error);
    return { status: 401, error: "Error while deleting user" };
  }
};

// user auth
export const auth = async (user: UserLogin): Promise<AuthResponse> => {
  try {
    // auth user
    const data = await userAPI.post("/auth/signin", user);
    if (data.data.status_code != 401) {
      const token = data.data.result.token;
      // create the cookie
      cookies().set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60,
      });
      return { status: 200, token: token };
    } else {
      return { status: 404, error: "Invalid username or password" };
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    return { status: 500, error: "Server error during authentication" };
  }
};

// logout 
export const logout = () => {
  try {
    // remove cookie
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
    return { status: 404, error: "Invalid username or password" };
  }
};

// decrypt function for jwt
export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

// update session
export async function updateSession(request: NextRequest) {
  // get current cookie
  const session = request.cookies.get(COOKIE_NAME)?.value;

  // if the cookie does not exist
  if (!session) return;

  // refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.exp = new Date(Date.now() + 10 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: COOKIE_NAME,
    value: session,
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60,
  });
  return res;
}

export async function updateSessionLocal(cookie: string) {
  cookies().set({
    name: COOKIE_NAME,
    value: cookie,
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60,
  });
}
