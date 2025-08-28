'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const ForceRefresh = () => {
  const router = useRouter()

  useEffect(() => {
    router.refresh()
  }, [router])

  return null // This component doesn't render anything
}

export default ForceRefresh
