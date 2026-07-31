import { Fragment, useState } from 'react'

import { DepthIcon, HeightIcon, WeightIcon, WidthIcon } from '../../../ui/Icons'
import { formatLength, formatWeight } from './formatMeasurement'
import type { SkuDimensions, SkuMeasurements } from './Measurements.types'
import styles from './Measurements.module.scss'

type PackageOption = 'withoutPackage' | 'withPackage'

interface MetricConfig {
  key: keyof SkuMeasurements
  label: string
  Icon: typeof HeightIcon
  format: (value?: number | null) => string | undefined
}

const METRICS: MetricConfig[] = [
  { key: 'height', label: 'Altura', Icon: HeightIcon, format: formatLength },
  { key: 'width', label: 'Largura', Icon: WidthIcon, format: formatLength },
  {
    key: 'length',
    label: 'Profundidade',
    Icon: DepthIcon,
    format: formatLength,
  },
  { key: 'weight', label: 'Peso', Icon: WeightIcon, format: formatWeight },
]

interface PackageToggleProps {
  active: PackageOption
  onChange: (option: PackageOption) => void
}

function PackageToggle({ active, onChange }: PackageToggleProps) {
  return (
    <div className={styles.measurements__toggle}>
      <button
        type="button"
        className={
          active === 'withoutPackage'
            ? `${styles.measurements__toggleOption} ${styles['measurements__toggleOption--active']}`
            : styles.measurements__toggleOption
        }
        onClick={() => onChange('withoutPackage')}
      >
        <span className={styles.measurements__toggleDivider} />
        <span className={styles.measurements__toggleLabel}>Sem embalagem</span>
      </button>

      <button
        type="button"
        className={
          active === 'withPackage'
            ? `${styles.measurements__toggleOption} ${styles['measurements__toggleOption--active']}`
            : styles.measurements__toggleOption
        }
        onClick={() => onChange('withPackage')}
      >
        <span className={styles.measurements__toggleDivider} />
        <span className={styles.measurements__toggleLabel}>Com embalagem</span>
      </button>
    </div>
  )
}

function MetricsRow({ measurements }: { measurements?: SkuMeasurements }) {
  const metrics = METRICS.map((metric) => ({
    ...metric,
    value: measurements ? metric.format(measurements[metric.key]) : undefined,
  })).filter((metric) => metric.value)

  if (metrics.length === 0) {
    return (
      <p className={styles.measurements__empty}>
        Medida não disponível para esta opção.
      </p>
    )
  }

  return (
    <div className={styles.measurements__metrics}>
      {metrics.map(({ key, label, Icon, value }, index) => (
        <Fragment key={key}>
          {index > 0 && <span className={styles.measurements__metricDivider} />}
          <div className={styles.measurements__metricContent}>
            <Icon className={styles.measurements__metricIcon} />
            <span className={styles.measurements__metricLabel}>{label}</span>
            <span className={styles.measurements__metricValue}>{value}</span>
          </div>
        </Fragment>
      ))}
    </div>
  )
}

interface MeasurementsProps {
  dimensions?: SkuDimensions | null
}

function Measurements({ dimensions }: MeasurementsProps) {
  const withPackage = dimensions?.withPackage ?? undefined
  const withoutPackage = dimensions?.withoutPackage ?? undefined
  const hasBothPackages = Boolean(withPackage) && Boolean(withoutPackage)

  const [active, setActive] = useState<PackageOption>(
    withoutPackage ? 'withoutPackage' : 'withPackage'
  )

  if (!withPackage && !withoutPackage) {
    return null
  }

  const activeMeasurements =
    active === 'withoutPackage' ? withoutPackage : withPackage

  return (
    <div className={styles.measurements}>
      <div className={styles.measurements__side}>
        <span className={styles.measurements__title}>Medidas do produto</span>

        {hasBothPackages && (
          <PackageToggle active={active} onChange={setActive} />
        )}
      </div>

      <div className={styles.measurements__content}>
        <MetricsRow measurements={activeMeasurements} />
      </div>
    </div>
  )
}

export default Measurements
