import { deleteStyle as deleteStyleApi } from '@services/api'

const deleteStyle = async (styleId: number) => {
  const response = await deleteStyleApi(styleId)

  return response
}

export default deleteStyle
