import type { LogoProps } from './Logo.types'
import styles from './Logo.module.scss'

function Logo({ src, alt, href = '/' }: LogoProps) {
  return (
    <a
      href={href}
      className={styles.logo}
      aria-label="Ir para a página inicial"
    >
      {src ? (
        <img src={src} alt={alt} width={110} height={48} />
      ) : (
        <span className={styles.logo__fallback}>{alt}</span>
      )}
    </a>
  )
}

export default Logo
