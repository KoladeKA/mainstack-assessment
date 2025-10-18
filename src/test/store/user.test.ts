import { describe, it, expect, beforeEach, vi } from "vitest"
import { useUserStore } from "../../store/user/userStore"
import axios_instance from "../../store/constants/api"
import type { AxiosResponse, AxiosError } from "axios"

describe("User Store", () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserStore?.setState({
      userData: null,
      isLoading: false,
      error: null,
    })
  })

  it("should initialize with default state", () => {
    const state = useUserStore.getState()

    expect(state.userData).toEqual(null)
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  it("should set loading state", () => {
    const { setIsLoading } = useUserStore.getState()

    setIsLoading(true)
    expect(useUserStore.getState().isLoading).toBe(true)

    setIsLoading(false)
    expect(useUserStore.getState().isLoading).toBe(false)
  })

  it("should set error state", () => {
    const { setError } = useUserStore.getState()

    setError("Test error")
    expect(useUserStore.getState().error).toBe("Test error")

    setError(null)
    expect(useUserStore.getState().error).toBeNull()
  })

  it("should fetch user info successfully", async () => {
    const mockDetail = {
      first_name: "Olivier",
      last_name: "Jones",
      email: "olivierjones@gmail.com"
    }

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockDetail),
      } as Response),
    )

    const { getUserInfo } = useUserStore.getState()
    await getUserInfo()

    const state = useUserStore.getState()
    expect(state.userData).toEqual(mockDetail)
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

    const { getUserInfo } = useUserStore.getState()
    await getUserInfo()

    const state = useUserStore.getState()
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

    const { getUserInfo } = useUserStore.getState()
    await getUserInfo()

    const state = useUserStore.getState()
    expect(state.error).toBe(error)
    expect(state.isLoading).toBe(false)
  })
})
