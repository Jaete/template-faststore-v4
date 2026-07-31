import { useRangeSlider } from './useRangeSlider'
import type { RangeSliderProps } from './RangeSlider.types'
import styles from './RangeSlider.module.scss'

function RangeSlider(props: RangeSliderProps) {
  const { min, max, step = 1 } = props
  const {
    localMin,
    localMax,
    minPercent,
    maxPercent,
    commit,
    handleMinChange,
    handleMaxChange,
  } = useRangeSlider(props)

  return (
    <div className={styles.rangeSlider}>
      <div className={styles.rangeSlider__track}>
        <div
          className={styles.rangeSlider__fill}
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
      </div>
      <input
        type="range"
        aria-label="Valor mínimo"
        className={styles.rangeSlider__input}
        min={min}
        max={max}
        step={step}
        value={localMin}
        onChange={handleMinChange}
        onMouseUp={commit}
        onTouchEnd={commit}
        onKeyUp={commit}
      />
      <input
        type="range"
        aria-label="Valor máximo"
        className={styles.rangeSlider__input}
        min={min}
        max={max}
        step={step}
        value={localMax}
        onChange={handleMaxChange}
        onMouseUp={commit}
        onTouchEnd={commit}
        onKeyUp={commit}
      />
    </div>
  )
}

export default RangeSlider
