import Button from '@libs/shared/button/Button'
import Link from 'next/link'

const CreateStyleButton = () => {
  return (
    <Link href="/styles/create">
      <Button>스타일 등록하기</Button>
    </Link>
  )
}

export default CreateStyleButton
