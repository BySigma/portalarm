interface AvatarInitialsProps {
  name: string
  size?: number
}

export function AvatarInitials({ name, size = 28 }: AvatarInitialsProps) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: 'var(--int-3)',
      border: '1px solid var(--int-4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.35,
      fontWeight: 600,
      color: 'var(--txt-11)',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}
