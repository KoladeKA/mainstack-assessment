import { describe, it, expect, beforeEach, vi } from "vitest"
import { useWalletStore } from "../../store/wallet/walletStore"
import axios_instance from "../../store/constants/api"
import type { AxiosResponse, AxiosError } from "axios"

describe("Wallet Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useWalletStore.setState({
        walletData: null,
        isLoading: false,
        error: null,
    })
  })


  it("should initialize with default state", () => {
    const state = useWalletStore.getState()

    expect(state.walletData).toEqual(null)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it("should set loading state", () => {
    const { setIsLoading } = useWalletStore.getState()

    setIsLoading(true)
    expect(useWalletStore.getState().isLoading).toBe(true)

    setIsLoading(false)
    expect(useWalletStore.getState().isLoading).toBe(false)
  })

  it("should set error state", () => {
    const { setError } = useWalletStore.getState()

    setError("Test error")
    expect(useWalletStore.getState().error).toBe("Test error")

    setError(null)
    expect(useWalletStore.getState().error).toBeNull()
  })

  it("should fetch wallet info successfully", async () => {
    const mockDetail = {
        balance: 750.56,
        total_payout: 500,
        total_revenue: 1250.56,
        pending_payout: 0,
        ledger_balance: 500
    }

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDetail),
      } as Response),
    )

    const { getWalletInfo } = useWalletStore.getState()
    await getWalletInfo()

    const state = useWalletStore.getState()
    expect(state.walletData).toEqual(mockDetail)
    expect(state.isLoading).toBe(false)
  })

    it("should handle 401 unauthorized error", async () => {
      const error = new Error("Unauthorized") as unknown as AxiosError
      error.response = {
        status: 401,
        data: { message: "Token expired" },
        statusText: "Unauthorized",
        headers: {},
        config: {},
      } as AxiosResponse

      vi.spyOn(axios_instance, "get").mockRejectedValueOnce(error)

      const { getWalletInfo } = useWalletStore.getState()
      await getWalletInfo()

      const state = useWalletStore.getState()
      expect(state.error).toBe(error)
      expect(state.isLoading).toBe(false)
    })

    it("should handle 500 server error", async () => {
      const error = new Error("Internal Server Error") as unknown as AxiosError
      error.response = {
        data: { message: "Server error" },
        status: 500,
        statusText: "Internal Server Error",
        headers: {},
        config: {},
      } as AxiosResponse

      vi.spyOn(axios_instance, "get").mockRejectedValueOnce(error)

      const { getWalletInfo } = useWalletStore.getState()
      await getWalletInfo()

      const state = useWalletStore.getState()
      expect(state.error).toBe(error)
      expect(state.isLoading).toBe(false)
    })
})
