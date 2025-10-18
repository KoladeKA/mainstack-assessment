/* eslint-disable  @typescript-eslint/no-explicit-any */

import { create } from "zustand";
import global from "../constants/global";
import type { AxiosResponse } from "axios";
import axios_instance from "../constants/api";


interface WalletState {
    walletData: any;
    isLoading: boolean;
    error: any;
    setIsLoading: (isLoading: boolean) => void
    setError: (error: string | null) => void
    getWalletInfo: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
    walletData: null,
    isLoading: false,
    error: null,


    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    getWalletInfo: async () => {
        set({ isLoading: true });

        try {
            const response: AxiosResponse = await axios_instance.get(
                `${global.apiBaseUrl}wallet`,
            );
            set({walletData:response.data})
            return response.data;
        } catch (error) {
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

}));
