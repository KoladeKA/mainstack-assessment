/* eslint-disable  @typescript-eslint/no-explicit-any */

import { create } from "zustand";
import global from "../constants/global";
import type { AxiosResponse } from "axios";
import axios_instance from "../constants/api";


interface UserState {
    userData: any;
    isLoading: boolean;
    error: any;
    setIsLoading: (isLoading: boolean) => void
    setError: (error: string | null) => void
    getUserInfo: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    userData: null,
    isLoading: false,
    error: null,


    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    getUserInfo: async () => {
        set({ isLoading: true });

        try {
            const response: AxiosResponse = await axios_instance.get(
                `${global.apiBaseUrl}user`,
            );
            set({userData:response.data})
            return response.data;
        } catch (error) {
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

}));
