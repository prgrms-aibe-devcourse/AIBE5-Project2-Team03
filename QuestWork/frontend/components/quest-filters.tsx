'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export interface QuestFilters {
  categories: string[]
  techStack: string[]
  minReward: number | null
  maxReward: number | null
  difficulty: string[]
}

interface QuestFiltersProps {
  filters: QuestFilters
  onFiltersChange: (filters: QuestFilters) => void
}

const TECH_STACK = [
  'React',
  'Next.js',
  'TypeScript',
  'Node.js',
  'Express',
  'MongoDB',
  'Firebase',
  'Java',
  'Spring',
  'PostgreSQL',
  'Python',
  'Docker',
  'Kubernetes',
  'AWS',
  'React Native',
  'Flutter',
]

const EMPTY_FILTERS: QuestFilters = {
  categories: [],
  techStack: [],
  minReward: null,
  maxReward: null,
  difficulty: [],
}

export function QuestFilters({ filters, onFiltersChange }: QuestFiltersProps) {
  const handleTechChange = (tech: string) => {
    const updated = filters.techStack.includes(tech)
      ? filters.techStack.filter((t) => t !== tech)
      : [...filters.techStack, tech]
    onFiltersChange({ ...filters, techStack: updated })
  }

  const FilterContent = () => (
    <div className="flex flex-col gap-6 px-5 py-4 sm:px-6 sm:py-0">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">기술 스택</h3>
          <p className="mt-1 text-xs text-foreground-muted">
            필요한 기술 스택을 선택해보세요.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => onFiltersChange(EMPTY_FILTERS)}
        >
          필터 초기화
        </Button>
      </div>

      <Separator />

      <div className="space-y-2">
        {TECH_STACK.map((tech) => {
          const isChecked = filters.techStack.includes(tech)

          return (
            <div
              key={tech}
              className={`flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors ${
                isChecked ? 'bg-primary-light/40' : 'hover:bg-surface-raised/70'
              }`}
            >
              <Checkbox
                id={`tech-${tech}`}
                checked={isChecked}
                onCheckedChange={() => handleTechChange(tech)}
              />
              <Label
                htmlFor={`tech-${tech}`}
                className={`cursor-pointer text-sm transition-colors ${
                  isChecked
                    ? 'font-semibold text-primary'
                    : 'font-normal text-foreground'
                }`}
              >
                {tech}
              </Label>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-surface py-6 lg:block">
        <FilterContent />
      </aside>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="mb-4">
              필터
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
