import { Fragment } from 'react'
import Breadcrumb from './Breadcrumb/Breadcrumb'
import ContactForm from './ContactForm/ContactForm'
import ContactMethods from './ContactMethods/ContactMethods'
import FaqAccordion from './FaqAccordion/FaqAccordion'
import FilesSection from './FilesSection/FilesSection'
import Highlight from './Highlight/Highlight'
import Locations from './Locations/Locations'
import Nav from './Nav/Nav'
import VideoBanner from '../../ui/VideoBanner/VideoBanner'
import {
  hasVisibleContent,
  renderRichText,
} from '../../../utils/renderRichText'
import type {
  InstitutionalPageBlock,
  InstitutionalPageProps,
} from './InstitutionalPage.types'
import { useInstitutionalPage } from './useInstitutionalPage'
import styles from './InstitutionalPage.module.scss'

function renderBlock(block: InstitutionalPageBlock, key: string) {
  switch (block.type) {
    case 'video': {
      if (!block.videoUrl) {
        return null
      }

      return (
        <div key={key} className={styles.institutionalPage__video}>
          <VideoBanner
            title={block.videoTitle}
            thumbnailUrl={block.videoThumbnailUrl}
            videoUrl={block.videoUrl}
            logoUrl={block.videoLogoUrl}
            compact
          />
        </div>
      )
    }

    case 'files': {
      if (!block.filesItems || block.filesItems.length === 0) {
        return null
      }

      return (
        <FilesSection
          key={key}
          title={block.filesTitle}
          description={block.filesDescription}
          items={block.filesItems}
        />
      )
    }

    case 'faq': {
      if (!block.faqItems || block.faqItems.length === 0) {
        return null
      }

      return <FaqAccordion key={key} items={block.faqItems} />
    }

    case 'contact': {
      const hasMethods =
        !!block.contactMethods && block.contactMethods.length > 0

      if (!block.contactShowForm && !hasMethods) {
        return null
      }

      return (
        <Fragment key={key}>
          {block.contactShowForm && (
            <ContactForm recipientEmail={block.contactRecipientEmail} />
          )}

          {hasMethods && (
            <ContactMethods
              title={block.contactMethodsTitle}
              methods={block.contactMethods ?? []}
            />
          )}
        </Fragment>
      )
    }

    case 'locations': {
      if (!block.locationsItems || block.locationsItems.length === 0) {
        return null
      }

      return (
        <Locations
          key={key}
          items={block.locationsItems}
          pinIconUrl={block.locationsPinIconUrl}
          phoneIconUrl={block.locationsPhoneIconUrl}
          clockIconUrl={block.locationsClockIconUrl}
          directionsIconUrl={block.locationsDirectionsIconUrl}
        />
      )
    }

    case 'highlight': {
      return (
        <Highlight
          key={key}
          highlight={{
            title: block.highlightTitle,
            text: block.highlightText,
            buttonLabel: block.highlightButtonLabel,
            buttonHref: block.highlightButtonHref,
            cardStyle: block.highlightCardStyle,
          }}
        />
      )
    }

    default:
      return null
  }
}

function InstitutionalPage({ groups }: InstitutionalPageProps) {
  const flatItems = groups.flatMap((group) => group.items)
  const { activeIndex, selectItem } = useInstitutionalPage({
    itemsCount: flatItems.length,
  })
  const activeItem = flatItems[activeIndex]

  const groupStarts = groups.reduce<number[]>((starts, group, index) => {
    starts.push(
      index === 0 ? 0 : starts[index - 1] + groups[index - 1].items.length
    )
    return starts
  }, [])

  const contentHtml = activeItem ? renderRichText(activeItem.content) : null
  const hasBanner = !!activeItem?.banner?.imageUrl

  const sectionClassName = [
    styles.institutionalPage,
    !hasBanner ? styles['institutionalPage--noBanner'] : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      {hasBanner && (
        <img
          src={activeItem?.banner?.imageUrl}
          alt={activeItem?.banner?.alt ?? ''}
          className={styles.institutionalPage__banner}
        />
      )}

      <section className={sectionClassName}>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            ...(activeItem ? [{ label: activeItem.label }] : []),
          ]}
        />

        <div className={styles.institutionalPage__layout}>
          <Nav
            groups={groups}
            groupStarts={groupStarts}
            activeIndex={activeIndex}
            onSelect={selectItem}
          />

          {activeItem && (
            <div className={styles.institutionalPage__content}>
              <h1 className={styles.institutionalPage__title}>
                {activeItem.label}
              </h1>

              {hasVisibleContent(contentHtml) && (
                <div
                  className={styles.institutionalPage__body}
                  dangerouslySetInnerHTML={{ __html: contentHtml ?? '' }}
                />
              )}

              {activeItem.blocks?.map((block, index) =>
                renderBlock(block, `${activeIndex}-${index}`)
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default InstitutionalPage
