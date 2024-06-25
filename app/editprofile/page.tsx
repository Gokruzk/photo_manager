"use client";
import Edit from "@/components/ProfileEdit";
import userStore from "@/store/auth/userStore";

export default function editprofile() {
  const user_info = userStore((state) => state.user);
  console.log(user_info);
  if (user_info) return <Edit user={user_info} />;
}
