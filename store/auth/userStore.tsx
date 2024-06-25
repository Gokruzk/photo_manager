import { User, UserState2 } from "@/types";
import { create } from "zustand";

const userStore = create<UserState2>((set) => ({
  user: null,
  authUser: (user: User) => set({ user }),
  removeSession: () => set({ user: null }),
}));

export default userStore;
