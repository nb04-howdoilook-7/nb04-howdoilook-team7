import { CuratingsSearchParams } from '@services/types'
import CuratingsLayout from '../ui-curating/CuratingsLayout'
import SearchBar from '@libs/shared/input/SearchBar/SearchBar'
import { SEARCH_BY_CURATING_FILTERS } from '@libs/shared/dropdown/constants'
import CuratingCreateButton from './CuratingCreateButton'
import getCuratings from '../data-access-curating/getCuratings'
import CuratingsContent from './CuratingsContent'

type CuratingsProps = {
  styleId: number
  searchParams: CuratingsSearchParams
  styleAuthorId: number
}

const Curatings = async ({ styleId, searchParams, styleAuthorId }: CuratingsProps) => {
  const { searchBy, keyword } = searchParams
  const { data: curatings, currentPage, totalItemCount, totalPages } = await getCuratings(styleId, searchParams)

  return (
    <CuratingsLayout
      postCuratingButton={(
        <CuratingCreateButton
          styleId={styleId}
          totalItemCount={totalItemCount}
        />
      )}
      searchBar={(
        <SearchBar
          initialKeyword={keyword}
          initialSearchBy={searchBy}
          inputWidth='100%'
          searchByFilters={SEARCH_BY_CURATING_FILTERS}
          hasPageParmas={true}
        />
      )}
      contents={(
        <CuratingsContent
          curatings={curatings}
          currentPage={currentPage}
          totalPages={totalPages}
          styleAuthorId={styleAuthorId}
        />
      )}
    />
  )
}

export default Curatings
