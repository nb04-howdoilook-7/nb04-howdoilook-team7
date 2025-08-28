'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@context/AuthContext'
import { useRouter } from 'next/navigation'
import * as api from '@services/api'
import styles from './page.module.scss'
import Image from 'next/image'
import Icon from '@libs/shared/icon/Icon'

export default function ProfileEditPage() {
  const { user, isLoading, updateUser, logout } = useAuth()
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || '')
      setProfileImage(user.profileImage || null)
    }
  }, [user])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const { imageUrl } = await api.uploadImage(file)
      setNewProfileImage(imageUrl)
      setProfileImage(imageUrl) // Update preview
    } catch (error) {
      alert('이미지 업로드에 실패했습니다.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword && !currentPassword) {
      alert('새 비밀번호를 입력하시려면 현재 비밀번호를 입력해야 합니다.')
      return
    }

    const payload: api.ProfileUpdateInput = { nickname }
    if (newPassword) {
      payload.password = newPassword
      payload.currentPassword = currentPassword
    }

    if (newProfileImage) {
      payload.profileImage = newProfileImage
    }

    try {
      const updatedUser = await api.updateMyProfile(payload)
      updateUser(updatedUser)
      alert('프로필이 성공적으로 업데이트되었습니다.')
      router.push('/mypage')
    } catch (error) {
      alert('프로필 업데이트에 실패했습니다. 현재 비밀번호를 확인해주세요.')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await api.deleteMyAccount()
      logout()
      alert('회원 탈퇴가 완료되었습니다.')
      router.push('/')
    } catch (error) {
      alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.')
    }
    setIsDeleteModalOpen(false)
  }

  if (isLoading || !user) {
    return <p>로딩 중...</p>
  }

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>프로필 수정</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* ... form groups ... */}
          <div className={styles.formGroup}>
            <label>프로필 사진</label>
            <div className={styles.profileImage}>
              <div className={styles.imagePreview}>
                {profileImage && <Image src={profileImage} alt="Profile" fill />}
              </div>
              <label className={styles.uploadButton}>
                이미지 업로드
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">새 비밀번호</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="변경할 경우에만 입력하세요"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">현재 비밀번호</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="비밀번호 변경 시 필수 입력"
            />
          </div>
          <button type="submit" className={styles.saveButton}>
            저장
          </button>
        </form>

        <button
          type="button"
          className={styles.deleteButton}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          회원 탈퇴
        </button>
      </div>

      {isDeleteModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>
              <Icon name="cancel" width={48} height={48} alt="경고" />
            </div>
            <h2 className={styles.modalTitle}>회원 탈퇴</h2>
            <p className={styles.modalMessage}>정말로 계정을 삭제하시겠습니까?<br />모든 데이터는 영구적으로 삭제되며 복구할 수 없습니다.</p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancelButton} onClick={() => setIsDeleteModalOpen(false)}>취소</button>
              <button className={styles.modalConfirmButton} onClick={handleDeleteAccount}>탈퇴 확인</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
