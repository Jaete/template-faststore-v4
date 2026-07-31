import type { InstitutionalPageGroup } from '../InstitutionalPage.types'

export interface NavProps {
  groups: InstitutionalPageGroup[]
  groupStarts: number[]
  activeIndex: number
  onSelect: (index: number) => void
}
