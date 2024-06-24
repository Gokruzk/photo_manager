import { COOKIE_NAME } from "@/constants";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";

export default function logout() {
  const router = useRouter()
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
}
