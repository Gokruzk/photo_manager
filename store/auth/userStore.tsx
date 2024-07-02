import { User_, UserState } from "@/types";
import { create } from "zustand";

const userStore = create<UserState>((set) => ({
  user: null,
  authUser: (user: User_) => set({ user }),
  removeSession: () => set({ user: null }),
}));

export default userStore;
