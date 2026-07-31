import type { InstitutionalPageFile } from '../InstitutionalPage.types'

export interface FilesSectionProps {
  title?: string
  description?: string
  items: InstitutionalPageFile[]
}
