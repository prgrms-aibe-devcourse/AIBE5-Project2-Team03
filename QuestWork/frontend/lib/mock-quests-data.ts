import type { Quest } from '@/components/quest-card'

export type QuestCategorySlug =
  | 'web-development'
  | 'mobile-development'
  | 'software-development'
  | 'wordpress-development'

export interface QuestCategoryMeta {
  slug: QuestCategorySlug
  label: string
  route: `/quests/${QuestCategorySlug}`
  description: string
}

export const QUEST_CATEGORIES: QuestCategoryMeta[] = [
  {
    slug: 'web-development',
    label: 'Web Development',
    route: '/quests/web-development',
    description: '웹사이트, 프론트엔드, 백엔드, 풀스택 관련 퀘스트',
  },
  {
    slug: 'mobile-development',
    label: 'Mobile Development',
    route: '/quests/mobile-development',
    description: 'iOS, Android, React Native 기반 모바일 개발 퀘스트',
  },
  {
    slug: 'software-development',
    label: 'Software Development',
    route: '/quests/software-development',
    description: '데스크톱 앱 및 시스템 소프트웨어 개발 퀘스트',
  },
  {
    slug: 'wordpress-development',
    label: 'WordPress Development',
    route: '/quests/wordpress-development',
    description: '워드프레스 구축, 커스터마이징, 유지보수 퀘스트',
  },
]

export const WEB_DEVELOPMENT_QUESTS: Quest[] = [
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
    techStack: ['Python', 'PostgreSQL', 'Git'],
    reward: '₩900,000',
    deadline: '4일 남음',
    participants: 11,
  },
  {
    id: '7',
    title: 'React Component Library',
    description:
      'Design and implement a reusable component library with Storybook documentation and TypeScript support.',
    techStack: ['React', 'TypeScript', 'Redux'],
    reward: '₩700,000',
    deadline: '8일 남음',
    participants: 25,
  },
  {
    id: '8',
    title: 'WordPress Plugin Development',
    description:
      'Build a custom WordPress plugin with admin settings, shortcodes, and comprehensive documentation.',
    techStack: ['PHP', 'MySQL', 'Git'],
    reward: '₩600,000',
    deadline: '9일 남음',
    participants: 7,
  },
  {
    id: '9',
    title: 'Mobile App UI/UX Redesign',
    description:
      'Redesign the user interface of an existing mobile application to improve user experience and accessibility.',
    techStack: ['React Native', 'Figma'],
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
    techStack: ['Next.js', 'React', 'PostgreSQL'],
    reward: '₩2,500,000',
    deadline: '14일 남음',
    participants: 28,
  },
  {
    id: '12',
    title: 'Node.js Chat Application',
    description:
      'Develop a real-time chat application with WebSocket support, user authentication, and message persistence.',
    techStack: ['Node.js', 'MongoDB', 'TypeScript'],
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
    techStack: ['Docker', 'AWS', 'Git'],
    reward: '₩850,000',
    deadline: '6일 남음',
    participants: 6,
  },
  {
    id: '15',
    title: 'Java Microservices Architecture',
    description:
      'Design a microservices-based system using Spring Boot with service discovery and load balancing.',
    techStack: ['Java', 'Spring', 'Redis'],
    reward: '₩1,700,000',
    deadline: '11일 남음',
    participants: 16,
  },
]

export const CATEGORY_PLACEHOLDER_QUESTS: Record<
  Exclude<QuestCategorySlug, 'web-development'>,
  Quest[]
> = {
  'mobile-development': [
    {
      id: 'mobile-1',
      title: 'React Native 커머스 앱 결제 플로우 개선',
      description:
        'React Native 기반 모바일 앱에서 결제 전환율을 높이기 위한 UI 및 상태 흐름 개선 작업입니다.',
      techStack: ['React Native', 'TypeScript', 'Firebase'],
      reward: '₩1,100,000',
      deadline: '6일 남음',
      participants: 13,
    },
    {
      id: 'mobile-2',
      title: 'Flutter 헬스케어 앱 온보딩 구축',
      description:
        'Flutter 앱의 첫 사용자 경험을 개선하기 위한 온보딩 화면 및 분석 이벤트 연결 작업입니다.',
      techStack: ['Flutter', 'Firebase'],
      reward: '₩900,000',
      deadline: '9일 남음',
      participants: 8,
    },
  ],
  'software-development': [
    {
      id: 'software-1',
      title: 'Electron 기반 사내 도구 배포 자동화',
      description:
        'Windows와 macOS 환경에 맞춘 데스크톱 앱 패키징 및 사내 배포 파이프라인 구성 작업입니다.',
      techStack: ['Electron', 'Node.js', 'CI/CD'],
      reward: '₩1,400,000',
      deadline: '8일 남음',
      participants: 10,
    },
    {
      id: 'software-2',
      title: 'Python 로그 분석 유틸리티 개선',
      description:
        '대용량 운영 로그를 빠르게 탐색할 수 있도록 데스크톱형 분석 도구를 개선하는 과제입니다.',
      techStack: ['Python', 'PySide', 'SQLite'],
      reward: '₩750,000',
      deadline: '5일 남음',
      participants: 6,
    },
  ],
  'wordpress-development': [
    {
      id: 'wp-1',
      title: 'WordPress 멤버십 결제 플러그인 커스터마이징',
      description:
        '기존 워드프레스 멤버십 사이트의 결제 플러그인을 요구사항에 맞게 확장하는 작업입니다.',
      techStack: ['WordPress', 'PHP', 'MySQL'],
      reward: '₩850,000',
      deadline: '7일 남음',
      participants: 9,
    },
    {
      id: 'wp-2',
      title: '기업형 WordPress 랜딩 페이지 성능 개선',
      description:
        '페이지 빌더 중심으로 운영 중인 사이트의 로딩 속도와 SEO 구조를 개선하는 과제입니다.',
      techStack: ['WordPress', 'PHP', 'SEO'],
      reward: '₩680,000',
      deadline: '4일 남음',
      participants: 11,
    },
  ],
}

export function getQuestCategoryBySlug(slug: QuestCategorySlug) {
  return QUEST_CATEGORIES.find((category) => category.slug === slug)
}
