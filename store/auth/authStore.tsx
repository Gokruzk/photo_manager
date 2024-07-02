import { UserName, UserSt } from "@/types";
import { create } from "zustand";

const useStore = create<UserSt>((set) => ({
  username: null,
  authUser: (username: UserName) => set({ username }),
  removeSession: () => set({ username: null }),
}));

export default useStore;
