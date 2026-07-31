import type { IconProps } from './Icon.types'

function MessengerIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.19.16.15.26.35.27.57l.05 1.78c.02.57.6.94 1.12.71l1.99-.88a.79.79 0 0 1 .53-.04c.91.25 1.88.38 2.8.38 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2Zm6 7.46-2.94 4.66a1.5 1.5 0 0 1-2.17.4l-2.34-1.75a.6.6 0 0 0-.72 0l-3.16 2.4c-.42.32-.97-.18-.69-.63l2.94-4.66a1.5 1.5 0 0 1 2.17-.4l2.34 1.75c.21.16.51.16.72 0l3.16-2.4c.42-.32.97.18.69.63Z"
        fill={color}
      />
    </svg>
  )
}

export default MessengerIcon
