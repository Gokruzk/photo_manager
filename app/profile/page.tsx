"use client"
import { logout } from "@/api/userAPI";
import LinkButton from "@/components/LinkButton";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter()
  const handleLogout = async () => {
    const result = await logout();
    if (result.status === 200) {
      router.push("/login")
    } else {
      console.error(result.error);
    }
  };
  return (
    <main>
      <h1>Profile Page</h1>
      <LinkButton title="Login" href="/login" style="" />
      <button onClick={handleLogout}>
        Logout
      </button>
    </main>
  );
};

export default ProfilePage;
