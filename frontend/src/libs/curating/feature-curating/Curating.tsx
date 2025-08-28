import { CuratingType } from '@services/types'
import CuratingLayout from '../ui-curating/CuratingLayout'
import CuratingOptionButtons from './CuratingOptionButtons'

type CuratingProps = {
  curating: CuratingType
  styleAuthorId: number
}

const Curating = ({ curating, styleAuthorId }: CuratingProps) => {
  return (
    <CuratingLayout
      curating={curating}
      optionButtons={<CuratingOptionButtons curating={curating} />}
      styleAuthorId={styleAuthorId}
    />
  )
}

export default Curating
