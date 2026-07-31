import { useEffect, useRef } from 'react'

import { useSlider } from '../../../hooks/useSlider'
import { useMergedRef } from '../../../hooks/useMergedRef'
import type { CarouselProps } from './Carousel.types'
import styles from './Carousel.module.scss'

function Carousel<T>({
  items,
  getItemKey,
  renderItem,
  className,
  orientation = 'horizontal',
  activeIndex: controlledIndex,
  onActiveIndexChange,
  loop = false,
  containerRef,
  as = 'div',
}: CarouselProps<T>) {
  const isVertical = orientation === 'vertical'
  const itemRefs = useRef<Array<HTMLElement | null>>([])
  const { ref, activeIndex } = useSlider<HTMLDivElement>({
    itemCount: items.length,
    activeIndex: controlledIndex,
    onActiveIndexChange,
    orientation,
    loop,
  })
  const mergedContainerRef = useMergedRef(ref, containerRef)

  const ContainerTag = as
  const ItemTag = as === 'ul' ? 'li' : 'div'

  useEffect(() => {
    const container = itemRefs.current[activeIndex]?.parentElement
    const item = itemRefs.current[activeIndex]

    if (!container || !item) {
      return
    }

    // Scroll apenas o container horizontal do carousel — não usar
    // scrollIntoView, que sobe a página inteira quando o item está fora
    // do viewport vertical (usuário rolou pra baixo).
    container.scrollTo(
      isVertical
        ? { top: item.offsetTop - container.offsetTop, behavior: 'smooth' }
        : { left: item.offsetLeft - container.offsetLeft, behavior: 'smooth' }
    )
  }, [activeIndex, isVertical])

  if (!items.length) {
    return null
  }

  const orientationClass = isVertical ? ` ${styles['carousel--vertical']}` : ''

  return (
    <ContainerTag
      ref={mergedContainerRef}
      className={`${styles.carousel}${orientationClass}${
        className ? ` ${className}` : ''
      }`}
    >
      {items.map((item, index) => (
        <ItemTag
          key={getItemKey(item, index)}
          ref={(node: HTMLElement | null) => {
            itemRefs.current[index] = node
          }}
          className={styles.carousel__item}
        >
          {renderItem(item, index)}
        </ItemTag>
      ))}
    </ContainerTag>
  )
}

export default Carousel
