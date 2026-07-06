import { ArrowLeft, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { pageHeaderStyles } from './PageHeader.styles'

interface PageHeaderProps {
  title: string
  showBack?: boolean
  onBack?: () => void
}

export function PageHeader({ title, showBack = false, onBack }: PageHeaderProps) {
  return (
    <header className={pageHeaderStyles.wrapper}>
      <div className={pageHeaderStyles.topRow}>
        {showBack ? (
          <Button variant="outline" size="icon" onClick={onBack} aria-label="Go back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-10" aria-hidden="true" />
        )}
        {!showBack && (
          <Button variant="outline" size="icon" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {showBack && <div className="w-10" aria-hidden="true" />}
      </div>
      <h1 className={pageHeaderStyles.title}>{title}</h1>
    </header>
  )
}
