/* eslint-disable  @typescript-eslint/no-explicit-any */

import { create } from "zustand";
import global from "../constants/global";
import type { AxiosResponse } from "axios";
import axios_instance from "../constants/api";


interface TransactionState {
    transactionData: any;
    isLoading: boolean;
    error: any;
    setIsLoading: (isLoading: boolean) => void
    setError: (error: string | null) => void
    getAllTransaction: () => Promise<void>;
}

export const useTransactionsStore = create<TransactionState>((set) => ({
    transactionData: null,
    isLoading: false,
    error: null,


    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    getAllTransaction: async () => {
        set({ isLoading: true });

        try {
            const response: AxiosResponse = await axios_instance.get(
                `${global.apiBaseUrl}transactions`,
            );
            set({transactionData:response.data})
            return response.data;
        } catch (error) {
            set({ error });
        } finally {
            set({ isLoading: false });
        }
    },

}));
