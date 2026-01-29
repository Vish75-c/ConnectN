import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice/auth-slice";

export const useAppStore=create()((...a)=>({
    ...createAuthSlice(...a),
}))