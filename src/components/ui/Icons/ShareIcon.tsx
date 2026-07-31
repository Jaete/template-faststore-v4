import type { IconProps } from './Icon.types'

function ShareIcon({ color = 'currentColor', ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <g stroke={color} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.2863 5.14265L12.0257 2.85693L9.71484 5.14265" />
        <path d="M12 2.85693V13.1426" />
        <path d="M8.57115 7.42822H7.42829C6.16593 7.42822 5.14258 8.45157 5.14258 9.71394V17.7139C5.14258 18.9763 6.16593 19.9997 7.42829 19.9997H16.5712C17.8335 19.9997 18.8569 18.9763 18.8569 17.7139V9.71394C18.8569 8.45157 17.8335 7.42822 16.5712 7.42822H15.4283" />
      </g>
    </svg>
  )
}

export default ShareIcon
