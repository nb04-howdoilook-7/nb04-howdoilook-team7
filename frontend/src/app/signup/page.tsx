'use client'

import React, { useState } from 'react'
import styles from './page.module.scss'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as api from '@services/api'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('') // Added nickname state
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // Nickname validation
    if (nickname.length < 3) {
      setError('닉네임은 최소 3자 이상이어야 합니다.')
      return
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!passwordRegex.test(password)) {
      setError('비밀번호는 숫자와 문자를 포함하는 8자리 이상이어야 합니다.')
      return
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다!')
      return
    }

    try {
      await api.requestVerification({ email, nickname, password })
      alert('인증 코드를 이메일로 발송했습니다. 이메일을 확인해주세요.')
      router.push(`/confirm-signup?email=${email}`)
    } catch (err: any) {
      console.error(err)
      setError(err.message || '이미 사용 중인 이메일이거나 요청에 실패했습니다.')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>회원가입</h1>
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
            <label htmlFor="nickname">닉네임</label>{' '}
            {/* Added nickname input */}
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
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
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.signupButton}>
            가입하기
          </button>
        </form>
        <p className={styles.loginPrompt}>
          이미 계정이 있으신가요? <Link href="/login">로그인</Link>
        </p>
      </div>
    </div>
  )
}
