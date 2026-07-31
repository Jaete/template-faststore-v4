export interface HelpButtonProps {
  onClick?: () => void
  onHover?: (isHovering: boolean) => void
  ariaLabel?: string
  disabled?: boolean
}
