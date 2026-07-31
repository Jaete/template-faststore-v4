import { DownloadIcon } from '../Icons'
import { downloadFile } from '../../../utils/downloadFile'
import type { FileDownloadItemProps } from './FileDownloadItem.types'
import styles from './FileDownloadItem.module.scss'

function FileDownloadItem({
  label,
  fileUrl,
  className,
}: FileDownloadItemProps) {
  const wrapperClassName = className
    ? `${styles.fileDownloadItem} ${className}`
    : styles.fileDownloadItem

  return (
    <div className={wrapperClassName}>
      <span className={styles.fileDownloadItem__label}>{label}</span>

      <button
        type="button"
        className={styles.fileDownloadItem__download}
        onClick={() => downloadFile(fileUrl)}
      >
        <DownloadIcon className={styles.fileDownloadItem__downloadIcon} />
        Download
      </button>
    </div>
  )
}

export default FileDownloadItem
