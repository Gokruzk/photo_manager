import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/constants";
import { decrypt } from "@/api/userAPI";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);
  if (!token) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
  const { value } = token;
  const data = await decrypt(value);
  try {
    const response = {
      username: data["username"],
    };
    return new Response(JSON.stringify(response));
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong", error,
      },
      {
        status: 401,
      }
    );
  }
}
