import type { SVGProps } from 'react'

function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M4 2.7v10.6a.6.6 0 00.9.5l8.6-5.3a.6.6 0 000-1L4.9 2.2a.6.6 0 00-.9.5z"
        fill="currentColor"
      />
    </svg>
  )
}

export default PlayIcon
