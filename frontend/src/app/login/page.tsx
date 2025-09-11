'use client'

import React, { useState } from 'react'
import styles from './page.module.scss'
import Link from 'next/link'
import { useAuth } from '@context/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    try {
      await login({ email, password })
      router.push('/') // 로그인 성공 시 홈으로 이동
    } catch (err) {
      console.error(err)
      setError('이메일 또는 비밀번호가 일치하지 않습니다.')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>로그인</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            로그인
          </button>
        </form>
        <p className={styles.signupPrompt}>
          계정이 없으신가요? <Link href="/signup">회원가입</Link>
        </p>
      </div>
    </div>
  )
}
