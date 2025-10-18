import { describe, it, expect, beforeEach, vi } from "vitest"
import { useTransactionsStore } from "../../store/transactions/useTransactionsStore"
import axios_instance from "../../store/constants/api"
import type { AxiosResponse, AxiosError } from "axios"

describe("Transaction Store", () => {
  beforeEach(() => {
    // Restore any spies/mocks before each test
    vi.restoreAllMocks()
    // Reset store state before each test
    useTransactionsStore.setState({
      transactionData: null,
      isLoading: false,
      error: null,
    })
  })

  it("should initialize with default state", () => {
    const state = useTransactionsStore.getState()

    expect(state.transactionData).toEqual(null)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it("should set loading state", () => {
    const { setIsLoading } = useTransactionsStore.getState()

    setIsLoading(true)
    expect(useTransactionsStore.getState().isLoading).toBe(true)

    setIsLoading(false)
    expect(useTransactionsStore.getState().isLoading).toBe(false)
  })

  it("should set error state", () => {
    const { setError } = useTransactionsStore.getState()

    setError("Test error")
    expect(useTransactionsStore.getState().error).toBe("Test error")

    setError(null)
    expect(useTransactionsStore.getState().error).toBeNull()
  })

  describe("Fetch Transactions with Axios", () => {
    it("should fetch transactions successfully via axios", async () => {
      const mockTransactions = [
        {
          amount: 500,
          metadata: {
            name: "John Doe",
            type: "digital_product",
            email: "johndoe@example.com",
            quantity: 1,
            country: "Nigeria",
            product_name: "Rich Dad Poor Dad"
          },
          payment_reference: "c3f7123f-186f-4a45-b911-76736e9c5937",
          status: "successful",
          type: "deposit",
          date: "2022-03-03"
        },
        {
          amount: 350.56,
          metadata: {
            name: "Delvan Ludacris",
            type: "webinar",
            email: "johndoe@example.com",
            quantity: 1,
            country: "Kenya",
            product_name: "How to build an online brand"
          },
          payment_reference: "73f45bc0-8f41-4dfb-9cae-377a32b71d1e",
          status: "successful",
          type: "deposit",
          date: "2022-03-01"

        }
      ]
      vi.spyOn(axios_instance, "get").mockResolvedValueOnce({
        data: mockTransactions,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      } as AxiosResponse<typeof mockTransactions>)
      const { getAllTransaction } = useTransactionsStore.getState()
      await getAllTransaction()

      const state = useTransactionsStore.getState()
      expect(state.transactionData).toEqual(mockTransactions)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it("should handle axios error when fetching transactions", async () => {
      const errorMessage = new Error("Failed to fetch transactions")

      vi.spyOn(axios_instance, "get").mockRejectedValueOnce(errorMessage)

      const { getAllTransaction } = useTransactionsStore.getState()
      await getAllTransaction()

      const state = useTransactionsStore.getState()
      expect(state.error).toBe(errorMessage)
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

      const { getAllTransaction } = useTransactionsStore.getState()
      await getAllTransaction()

      const state = useTransactionsStore.getState()
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

      const { getAllTransaction } = useTransactionsStore.getState()
      await getAllTransaction()

      const state = useTransactionsStore.getState()
      expect(state.error).toBe(error)
      expect(state.isLoading).toBe(false)
    })
  })
})
