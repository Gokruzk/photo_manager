"use server";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/constants";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import axios from "axios";
import {
  ApiPromiseUser,
  AuthResponse,
  User,
  UserDetail,
  UserLogin,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const key = new TextEncoder().encode(process.env.NEXT_PUBLIC_SECRET_KEY);

const userAPI = axios.create({
  baseURL: API_URL,
});

//get user
export const getUser = async (username: string): Promise<ApiPromiseUser> => {
  try {
    const res = await userAPI.get(`/user/${username}`);
    if (res.status === 200) {
      return { status: res.status, data: res.data.result };
    } else {
      return { status: res.status, error: res.data.detail };
    }
  } catch (error: any) {
    console.log(error);
    return { status: 400, error: error.response.data.detail };
  }
};

//add user
export const addUser = async (user: User): Promise<ApiPromiseUser> => {
  try {
    const res = await userAPI.post("/user", user);
    if (res.status === 201) {
      cookies().set({
        name: COOKIE_NAME,
        value: res.data.result["token"],
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60,
      });
      return { status: res.status };
    } else {
      return { status: res.status, error: res.data.detail };
    }
  } catch (error: any) {
    console.error(error);
    return { status: 400, error: error.response.data.detail };
  }
};

// update user
export const updateUser = async (
  username: string,
  user: UserDetail
): Promise<ApiPromiseUser> => {
  try {
    const res = await userAPI.put(`/user/${username}`, user);
    if (res.status === 204) {
      // auth the user with the new data
      const au_res = await auth({
        username: user.username,
        password: user.password,
      });
      if (au_res.status == 204 && au_res.token) {
        // update session with the new token
        updateSessionLocal(au_res.token);
        return { status: res.status };
      }
      return { status: res.status };
    } else {
      return {
        status: res.status,
        error: res.data.detail,
      };
    }
  } catch (error: any) {
    console.error(error);
    return { status: 400, error: error.response.data.detail };
  }
};

// delete user
export const deleteUser = async (username: string): Promise<ApiPromiseUser> => {
  try {
    const res = await userAPI.delete(`/user/${username}`);
    // remove cookie
    if (res.status === 204) {
      cookies().set({
        name: COOKIE_NAME,
        value: "",
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      });
      return { status: res.status };
    } else {
      return {
        status: res.status,
        error: res.data.detail,
      };
    }
  } catch (error: any) {
    console.error(error);
    return { status: 400, error: error.response.data.detail };
  }
};

// user auth
export const auth = async (user: UserLogin): Promise<AuthResponse> => {
  try {
    // auth user
    const res = await userAPI.post("/auth/signin", user);
    if (res.status === 200) {
      const token = res.data.result.token;
      // create the cookie
      cookies().set({
        name: COOKIE_NAME,
        value: token,
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60,
      });
      return { status: res.status, token: token };
    } else {
      return { status: res.status, error: res.data.detail };
    }
  } catch (error:any) {
    console.error(error);
    return { status: 500, error: error.response.data.detail };
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
