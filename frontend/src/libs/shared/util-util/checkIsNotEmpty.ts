const checkIsNotEmpty = <T extends object>(
  obj: T | null | undefined,
): obj is T => {
  // obj가 null 또는 undefined가 아니고, 실제 객체일 때만 Object.keys를 실행
  return (
    obj != null && typeof obj === 'object' && Object.keys(obj).length !== 0
  )
}

export default checkIsNotEmpty
