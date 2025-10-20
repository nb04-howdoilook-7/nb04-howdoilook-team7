import { StyleDetail as StyleDetailType } from '@services/types'
import getStyleDetail from '../data-access-style-detail/getStyleDetail'
import StyleDetailLayout from '../ui-style-detail/StyleDetailLayout'
import StyleImageCarousel from '../ui-style-detail/StyleImageCarousel'
import StyleOptionButtons from './StyleOptionButtons'

type StyleDetailProps = {
  styleId: number
  initialStyleDetail?: StyleDetailType
}

const StyleDetail = async ({ styleId, initialStyleDetail }: StyleDetailProps) => {
  const styleDetail = initialStyleDetail || (await getStyleDetail(styleId))
  const { imageUrls, ...styleDetailContent } = styleDetail

  return (
    <StyleDetailLayout
      styleDetailContent={styleDetailContent}
      styleImageCarousel={<StyleImageCarousel imageUrls={imageUrls} />}
      optionButtons={<StyleOptionButtons styleId={styleId} user={styleDetail.user} />}
    />
  )
}

export default StyleDetail
