import { UserName, UserState } from "@/types";
import { create } from "zustand";

const useStore = create<UserState>((set) => ({
  username: null,
  authUser: (username: UserName) => set({ username }),
  removeSession: () => set({ username: null }),
}));

export default useStore;
