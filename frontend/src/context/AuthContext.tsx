'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import * as api from '@/services/api'
import { UserProfile, LoginFormInput } from '@/services/types'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: UserProfile | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (credentials: LoginFormInput) => Promise<void>
  logout: () => void
  refreshUserProfile: () => Promise<void>
  updateUser: (user: UserProfile) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkUserStatus = useCallback(async () => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const profile = await api.getMyProfile()
        setUser(profile)
      } catch (error) {
        console.error(
          '유효하지 않은 토큰으로 프로필 조회에 실패했습니다.',
          error
        )
        api.logout()
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    checkUserStatus()
  }, [checkUserStatus])

  const login = useCallback(
    async (credentials: LoginFormInput) => {
      try {
        await api.login(credentials)
        await checkUserStatus()
      } catch (error) {
        console.error('로그인에 실패했습니다.', error)
        throw error
      }
    },
    [checkUserStatus]
  )

  const logout = useCallback(() => {
    api.logout()
    setUser(null)
    router.push('/login')
  }, [router])

  const refreshUserProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      const profile = await api.getMyProfile()
      setUser(profile)
    } catch (error) {
      console.error('프로필 갱신에 실패했습니다.', error)
      setUser(null) // 에러 발생 시 사용자 상태를 확실히 비움
    }
    setIsLoading(false)
  }, [])

  const updateUser = useCallback((updatedUser: UserProfile) => {
    setUser(updatedUser)
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      alert('세션이 만료되었습니다. 다시 로그인해주세요.')
      logout()
    }

    window.addEventListener('unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized)
    }
  }, [logout])

  const value = {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    logout,
    refreshUserProfile,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
