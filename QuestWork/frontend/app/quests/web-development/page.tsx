'use client'

import { useMemo, useState } from 'react'
import { GlobalNav } from '@/components/global-nav'
import {
  QuestFilters,
  type QuestFilters as QuestFiltersType,
} from '@/components/quest-filters'
import { QuestCard, type Quest } from '@/components/quest-card'
import { QuestSearch } from '@/components/quest-search'
import { Button } from '@/components/ui/button'
import { Pagination } from '@/components/ui/pagination'

// Mock quest data
const MOCK_QUESTS: Quest[] = [
  {
    id: '1',
    title: 'React Admin Dashboard Performance Optimization',
    description:
      'Improve rendering performance and reduce bundle size in a React admin dashboard.',
    techStack: ['React', 'Next.js', 'TypeScript'],
    reward: '₩1,000,000',
    deadline: '5일 남음',
    participants: 15,
  },
  {
    id: '2',
    title: 'Mobile App for Task Management',
    description:
      'Develop a cross-platform task management application with offline capabilities and cloud synchronization.',
    techStack: ['React Native', 'Firebase'],
    reward: '₩800,000',
    deadline: '7일 남음',
    participants: 12,
  },
  {
    id: '3',
    title: 'REST API for Microservices Architecture',
    description:
      'Design and implement a robust REST API with authentication, rate limiting, and comprehensive documentation.',
    techStack: ['Node.js', 'Express', 'MongoDB'],
    reward: '₩1,500,000',
    deadline: '3일 남음',
    participants: 22,
  },
  {
    id: '4',
    title: 'Kubernetes Deployment & CI/CD Pipeline',
    description:
      'Set up a complete Kubernetes cluster with automated CI/CD pipelines for a multi-container application.',
    techStack: ['Kubernetes', 'Docker', 'Jenkins'],
    reward: '₩2,000,000',
    deadline: '10일 남음',
    participants: 8,
  },
  {
    id: '5',
    title: 'Spring Boot REST Service',
    description:
      'Build a scalable Spring Boot application with database integration, caching, and API documentation.',
    techStack: ['Java', 'Spring', 'PostgreSQL'],
    reward: '₩1,200,000',
    deadline: '6일 남음',
    participants: 18,
  },
  {
    id: '6',
    title: 'Python Data Processing Pipeline',
    description:
      'Create an ETL pipeline to process large datasets with data validation, transformation, and export capabilities.',
    techStack: ['Python', 'Pandas', 'PostgreSQL'],
    reward: '₩900,000',
    deadline: '4일 남음',
    participants: 11,
  },
  {
    id: '7',
    title: 'React Component Library',
    description:
      'Design and implement a reusable component library with Storybook documentation and TypeScript support.',
    techStack: ['React', 'TypeScript', 'Storybook'],
    reward: '₩700,000',
    deadline: '8일 남음',
    participants: 25,
  },
  {
    id: '8',
    title: 'WordPress Plugin Development',
    description:
      'Build a custom WordPress plugin with admin settings, shortcodes, and comprehensive documentation.',
    techStack: ['PHP', 'WordPress'],
    reward: '₩600,000',
    deadline: '9일 남음',
    participants: 7,
  },
  {
    id: '9',
    title: 'Mobile App UI/UX Redesign',
    description:
      'Redesign the user interface of an existing mobile application to improve user experience and accessibility.',
    techStack: ['React Native', 'Design'],
    reward: '₩950,000',
    deadline: '5일 남음',
    participants: 19,
  },
  {
    id: '10',
    title: 'AWS Infrastructure Optimization',
    description:
      'Optimize existing AWS infrastructure for cost efficiency and performance, including auto-scaling configuration.',
    techStack: ['AWS', 'Terraform'],
    reward: '₩1,800,000',
    deadline: '2일 남음',
    participants: 5,
  },
  {
    id: '11',
    title: 'Next.js E-commerce Platform',
    description:
      'Build a full-stack e-commerce platform with payment integration, product management, and order tracking.',
    techStack: ['Next.js', 'React', 'Stripe'],
    reward: '₩2,500,000',
    deadline: '14일 남음',
    participants: 28,
  },
  {
    id: '12',
    title: 'Node.js Chat Application',
    description:
      'Develop a real-time chat application with WebSocket support, user authentication, and message persistence.',
    techStack: ['Node.js', 'Socket.io', 'MongoDB'],
    reward: '₩1,100,000',
    deadline: '8일 남음',
    participants: 14,
  },
  {
    id: '13',
    title: 'Flutter Mobile Game',
    description:
      'Create a casual mobile game with Flutter, including animations, sound effects, and leaderboard system.',
    techStack: ['Flutter', 'Firebase'],
    reward: '₩1,300,000',
    deadline: '12일 남음',
    participants: 9,
  },
  {
    id: '14',
    title: 'Docker Container Optimization',
    description:
      'Optimize Docker containers for production use, including security hardening and performance tuning.',
    techStack: ['Docker', 'Linux'],
    reward: '₩850,000',
    deadline: '6일 남음',
    participants: 6,
  },
  {
    id: '15',
    title: 'Java Microservices Architecture',
    description:
      'Design a microservices-based system using Spring Boot with service discovery and load balancing.',
    techStack: ['Java', 'Spring', 'Eureka'],
    reward: '₩1,700,000',
    deadline: '11일 남음',
    participants: 16,
  },
]

const QUESTS_PER_PAGE = 10

export default function WebDevelopmentQuestsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<QuestFiltersType>({
    categories: [],
    techStack: [],
    minReward: null,
    maxReward: null,
    difficulty: [],
  })

  // Filter and search quests
  const filteredQuests = useMemo(() => {
    return MOCK_QUESTS.filter((quest) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !quest.title.toLowerCase().includes(query) &&
          !quest.description.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Tech stack filter
      if (filters.techStack.length > 0) {
        const hasMatchingTech = quest.techStack.some((tech) =>
          filters.techStack.includes(tech)
        )
        if (!hasMatchingTech) return false
      }

      return true
    })
  }, [searchQuery, filters])

  // Pagination
  const totalPages = Math.ceil(filteredQuests.length / QUESTS_PER_PAGE)
  const paginatedQuests = filteredQuests.slice(
    (currentPage - 1) * QUESTS_PER_PAGE,
    currentPage * QUESTS_PER_PAGE
  )

  // Reset page when filters change
  const handleFiltersChange = (newFilters: QuestFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  return (
    <div className="bg-background">
      <GlobalNav />

      <main className="mx-auto max-w-content px-4 py-8 sm:px-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Web Development Quests
          </h1>
          <p className="mt-1 text-foreground-muted">
            {filteredQuests.length} quest{filteredQuests.length !== 1 ? 's' : ''}{' '}
            found
          </p>
        </div>

        {/* Search */}
        <QuestSearch value={searchQuery} onChange={handleSearchChange} />

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <QuestFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {/* Content */}
          <div className="flex-1">
            {paginatedQuests.length > 0 ? (
              <>
                {/* Quest Grid */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {paginatedQuests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-border bg-surface py-12">
                <p className="text-center text-foreground-muted">
                  No quests found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    handleFiltersChange({
                      categories: [],
                      techStack: [],
                      minReward: null,
                      maxReward: null,
                      difficulty: [],
                    })
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
