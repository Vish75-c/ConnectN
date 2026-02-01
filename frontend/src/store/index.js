import { create } from "zustand";
import { createAuthSlice } from "./slices/auth-slice/auth-slice";
import { createChatSlice } from "./slices/chat-slice/chat-slice";
export const useAppStore=create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a)
}))