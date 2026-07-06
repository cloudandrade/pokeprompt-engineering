import { Badge } from '@/components/ui/badge'
import { typeBadgeStyles } from './TypeBadge.styles'

interface TypeBadgeListProps {
  types: string[]
  variant?: 'default' | 'glass'
}

export function TypeBadgeList({ types, variant = 'glass' }: TypeBadgeListProps) {
  return (
    <div className={typeBadgeStyles.list}>
      {types.map((typeName) => (
        <Badge key={typeName} variant={variant}>
          {typeName}
        </Badge>
      ))}
    </div>
  )
}
