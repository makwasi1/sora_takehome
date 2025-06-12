import { useState } from "react"
import { useRouter } from "next/navigation"

interface AuthResponse {
  message: string
  user: any
  error?: string
  emailSent?: boolean
}

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const register = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)
      setError(null)

      if (!email || !password || !fullName) {
        throw new Error("All fields are required")
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, fullName }),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      if (!data.emailSent) {
        router.push("/home")
      }
      
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      router.push("/home")
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Logout failed")
      }

      router.push("/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    register,
    login,
    logout,
    loading,
    error,
  }
} 


//logout user
