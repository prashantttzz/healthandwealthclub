"use client"

type TikTokIconProps = {
  className?: string
}

const TikTokIcon = ({ className = "w-5 h-5" }: TikTokIconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.38V2h-3.2v12.36a2.89 2.89 0 1 1-2-2.75V8.36a6.08 6.08 0 1 0 5.2 6v-6.3a8.06 8.06 0 0 0 4.8 1.6V6.5c-.35 0-.7-.03-1.03-.11Z" />
    </svg>
  )
}

export default TikTokIcon
