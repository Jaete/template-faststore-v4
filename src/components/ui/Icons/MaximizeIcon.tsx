import type { SVGProps } from 'react'

function MaximizeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M8.5 3.5H4a.5.5 0 00-.5.5v4.5M15.5 3.5H20a.5.5 0 01.5.5v4.5M8.5 20.5H4a.5.5 0 01-.5-.5v-4.5M15.5 20.5H20a.5.5 0 00.5-.5v-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MaximizeIcon
