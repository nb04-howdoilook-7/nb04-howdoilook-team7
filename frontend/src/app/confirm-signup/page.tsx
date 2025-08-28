'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import * as api from '@/services/api'
import styles from './page.module.scss'
import Link from 'next/link'

const ConfirmSignupComponent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!email) {
      setError('이메일 정보가 없습니다. 다시 시도해주세요.')
      setLoading(false)
      return
    }

    try {
      const data = await api.confirmSignup({ email, code })

      localStorage.setItem('accessToken', data.accessToken)
      alert('회원가입이 완료되었습니다!')
      router.push('/')

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>이메일 인증</h1>
        <p style={{ marginBottom: '20px', color: '#555' }}>
          <strong>{email}</strong>으로 전송된 6자리 인증 코드를 입력해주세요.
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="code">인증 코드</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="인증 코드 6자리"
              maxLength={6}
              disabled={loading}
              required
            />
          </div>
          <button type="submit" disabled={loading} className={styles.signupButton}>
            {loading ? '인증 중...' : '인증하고 가입 완료'}
          </button>
        </form>
        <p className={styles.loginPrompt}>
          <Link href="/signup">이메일을 받지 못하셨나요?</Link>
        </p>
      </div>
    </div>
  )
}

export default function ConfirmSignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmSignupComponent />
    </Suspense>
  )
}
