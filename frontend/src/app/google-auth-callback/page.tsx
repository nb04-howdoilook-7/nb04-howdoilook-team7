'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

// 이 페이지는 보이지 않고, 토큰 처리 후 즉시 리디렉션됩니다.
export default function LoginCallback() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { refreshUserProfile } = useAuth() // 프로필을 새로고침하는 함수를 사용

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')

    const processLogin = async () => {
      if (accessToken) {
        // 1. 토큰을 저장
        localStorage.setItem('accessToken', accessToken)
        document.cookie = `accessToken=${accessToken}; path=/; max-age=3600; samesite=lax`

        // 2. 토큰 저장 후, 프로필 정보를 강제로 다시 불러와서 로그인 상태를 업데이트
        await refreshUserProfile()

        // 3. 홈으로 리디렉션
        router.push('/')
      } else {
        // 토큰이 없으면 로그인 페이지로
        console.error('로그인 콜백: 액세스 토큰이 없습니다.')
        router.push('/login')
      }
    }

    processLogin()
  }, [searchParams, router, refreshUserProfile])

  // 처리 중에는 간단한 로딩 메시지만 표시
  return <p>로그인 정보를 처리 중입니다...</p>
}
