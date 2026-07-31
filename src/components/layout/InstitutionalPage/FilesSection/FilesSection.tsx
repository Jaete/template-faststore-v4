import FileDownloadItem from '../../../ui/FileDownloadItem/FileDownloadItem'
import type { FilesSectionProps } from './FilesSection.types'
import styles from '../InstitutionalPage.module.scss'

function FilesSection({ title, description, items }: FilesSectionProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className={styles.institutionalPage__files}>
      {title && (
        <h2 className={styles.institutionalPage__filesTitle}>{title}</h2>
      )}

      {description && (
        <p className={styles.institutionalPage__filesDescription}>
          {description}
        </p>
      )}

      {items.map((file, index) => (
        <FileDownloadItem
          key={index}
          label={file.label}
          fileUrl={file.fileUrl}
        />
      ))}
    </div>
  )
}

export default FilesSection
