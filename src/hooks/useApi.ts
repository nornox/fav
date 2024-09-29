import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

export function useApi() {
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const cookieToken = Cookies.get('token')
    if (cookieToken) {
      setToken(cookieToken)
    } else {
      router.push('/login')
    }
  }, [router])

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error('No token available')
    }

    const headers = new Headers(options.headers)
    headers.set('Authorization', `Bearer ${token}`)

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      Cookies.remove('token')
      router.push('/login')
      throw new Error('Unauthorized')
    }

    return response
  }

  return { fetchWithAuth }
}