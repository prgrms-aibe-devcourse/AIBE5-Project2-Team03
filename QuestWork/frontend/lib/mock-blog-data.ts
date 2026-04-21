export interface BlogAuthor {
  username: string
  name: string
  profileImage: string
  bio: string
  shortIntro: string
  techStack: string[]
  series: string[]
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string[]
  publishedAt: string
  readTime: string
  tags: string[]
  views: number
  likes: number
  comments: number
  featured: boolean
  author: BlogAuthor
}

export interface ManagedBlogPost {
  id: string
  title: string
  status: '게시됨' | '초안'
  date: string
  views: string
}

const AUTHORS: BlogAuthor[] = [
  {
    username: 'kim-dev',
    name: '김개발',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kim-dev',
    bio: '3년차 풀스택 개발자입니다. React, Next.js, Java, Spring을 중심으로 사용자에게 오래 남는 제품을 만들고 있습니다.',
    shortIntro: '프론트엔드와 API 설계를 함께 다루는 풀스택 개발자',
    techStack: ['React', 'Next.js', 'Java', 'Spring', 'TypeScript', 'Node.js'],
    series: ['Next.js 실전 운영기', '문제 해결 노트'],
  },
  {
    username: 'park-ui',
    name: '박유아이',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=park-ui',
    bio: '디자인 시스템과 프론트엔드 협업 구조를 다듬는 일을 좋아합니다. 코드와 화면 모두 오래 가는 형태를 고민합니다.',
    shortIntro: '디자인 시스템과 UX 디테일을 다듬는 프론트엔드 엔지니어',
    techStack: ['React', 'TypeScript', 'Storybook', 'Figma'],
    series: ['UI 시스템 로그'],
  },
  {
    username: 'lee-backend',
    name: '이백엔드',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lee-backend',
    bio: 'Spring 기반 백엔드와 운영 자동화에 관심이 많습니다. 성능 문제를 수치로 확인하고 안정적으로 개선하는 과정을 기록합니다.',
    shortIntro: 'Spring과 운영 자동화에 강한 백엔드 개발자',
    techStack: ['Spring', 'Java', 'PostgreSQL', 'Redis', 'Docker'],
    series: ['API 운영 메모'],
  },
]

function getAuthor(username: string) {
  const author = AUTHORS.find((item) => item.username === username)

  if (!author) {
    throw new Error(`Unknown author: ${username}`)
  }

  return author
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'nextjs-app-router-data-flow',
    title: 'Next.js App Router에서 데이터 흐름 정리하기',
    excerpt:
      '서버 컴포넌트와 클라이언트 컴포넌트를 섞어 쓰는 상황에서 데이터 책임을 어떻게 나누면 좋은지 실무 기준으로 정리했습니다.',
    content: [
      '프로젝트가 커질수록 데이터를 어디에서 불러오고 어디에서 가공할지 결정하는 일이 생각보다 자주 발목을 잡습니다. 특히 App Router를 도입하면 서버 컴포넌트와 클라이언트 컴포넌트의 경계가 더 분명해지기 때문에, 처음에는 오히려 코드가 낯설게 느껴질 수 있습니다.',
      '제가 먼저 정리한 기준은 세 가지였습니다. 첫째, 화면 첫 진입에 반드시 필요한 데이터는 서버 컴포넌트에서 불러옵니다. 둘째, 사용자 상호작용으로만 달라지는 상태는 클라이언트에서 관리합니다. 셋째, 여러 화면에서 재사용되는 데이터 조합은 함수나 전용 모듈로 분리해 화면 코드에서 의도를 더 잘 드러내도록 합니다.',
      '이 기준으로 다시 구조를 나누면 페이지 컴포넌트는 데이터를 조립하고, 섹션 컴포넌트는 받은 값을 표현하는 데 집중하게 됩니다. 덕분에 로딩 전략이나 캐싱 정책을 바꿀 때도 수정 범위가 눈에 띄게 줄었습니다.',
      '결국 App Router의 장점은 새로운 문법보다 책임 분리에 있다고 느꼈습니다. 데이터를 어디서 가져올지보다 어떤 컴포넌트가 어떤 책임을 가져야 하는지 먼저 정하면 구조가 훨씬 선명해집니다.',
    ],
    publishedAt: '2024-04-10',
    readTime: '8분',
    tags: ['Next.js', 'React', 'TypeScript'],
    views: 1240,
    likes: 84,
    comments: 12,
    featured: true,
    author: getAuthor('kim-dev'),
  },
  {
    id: '2',
    slug: 'react-performance-checklist',
    title: 'React 성능 최적화 체크리스트',
    excerpt:
      '렌더링 비용을 줄이고 체감 성능을 개선할 때 실제로 먼저 확인하는 항목들을 체크리스트 형태로 정리했습니다.',
    content: [
      '성능 최적화는 도구보다 순서가 중요했습니다. 문제를 명확히 측정하지 않은 채 메모이제이션만 늘리면 코드만 복잡해지고 실제 병목은 그대로 남는 경우가 많았습니다.',
      '저는 먼저 React DevTools Profiler로 느린 상호작용을 찾고, 그다음 불필요한 상위 상태 보유 여부를 확인합니다. 상태가 지나치게 위에 있으면 작은 입력 하나에도 넓은 영역이 다시 렌더링됩니다.',
      '그다음 보는 것은 비동기 요청과 리스트 렌더링입니다. 스켈레톤, 지연 렌더링, 가상화 중 무엇이 더 효과적인지 화면 성격에 따라 선택해야 합니다. 무조건 하나의 기법을 밀기보다 사용자 경험에 가장 직접적인 부분을 먼저 개선하는 것이 좋았습니다.',
      '최적화의 끝은 숫자와 사용자 반응이 함께 좋아지는 지점이라고 생각합니다. 성능은 기술 과시가 아니라 사용자가 기다리지 않게 만드는 일에 가깝습니다.',
    ],
    publishedAt: '2024-04-05',
    readTime: '10분',
    tags: ['React', 'Performance', 'TypeScript'],
    views: 860,
    likes: 62,
    comments: 9,
    featured: true,
    author: getAuthor('kim-dev'),
  },
  {
    id: '3',
    slug: 'typescript-advanced-patterns',
    title: 'TypeScript 고급 타입 설계 노트',
    excerpt:
      'Generic, Union, Intersection을 조합해 컴포넌트와 API 타입 안정성을 높이는 패턴을 사례 중심으로 정리했습니다.',
    content: [
      'TypeScript를 오래 쓰다 보면 문법 자체보다 어떤 경계를 타입으로 막을지 판단하는 일이 더 중요해집니다. 타입을 많이 쓰는 것과 잘 쓰는 것은 다르다는 점을 자주 체감했습니다.',
      '특히 공통 컴포넌트에서 props 조합이 많아질수록 분기별 허용 조건을 타입으로 표현해 두는 편이 유지보수에 훨씬 유리했습니다. 런타임에만 확인하던 제약을 작성 단계에서 드러낼 수 있기 때문입니다.',
      '또한 API 응답 타입은 화면에서 곧바로 쓰지 않고, 화면 친화적인 뷰 모델로 한 번 더 변환하는 방식을 선호합니다. 이 과정이 있으면 서버 응답 구조가 달라져도 UI 수정 범위를 좁힐 수 있습니다.',
      '결국 타입은 안전장치이자 협업 문서였습니다. 팀이 함께 읽을 수 있는 언어로 설계 의도를 남겨두는 일이라고 생각합니다.',
    ],
    publishedAt: '2024-03-28',
    readTime: '12분',
    tags: ['TypeScript', 'Architecture', 'React'],
    views: 540,
    likes: 41,
    comments: 6,
    featured: false,
    author: getAuthor('kim-dev'),
  },
  {
    id: '4',
    slug: 'design-system-release-notes',
    title: '디자인 시스템을 팀에 안착시키는 배포 전략',
    excerpt:
      '컴포넌트 라이브러리를 만드는 것보다 팀이 실제로 사용하게 만드는 과정이 더 중요했습니다. 배포와 운영 방식을 중심으로 정리했습니다.',
    content: [
      '디자인 시스템은 예쁜 컴포넌트를 만드는 일에서 끝나지 않았습니다. 실제 서비스 팀이 안심하고 가져다 쓸 수 있도록 버전 정책, 문서화, 변경 이력 관리가 함께 움직여야 했습니다.',
      '가장 효과가 있었던 방법은 작은 성공 경험을 빨리 만드는 것이었습니다. 버튼과 입력창처럼 영향력이 큰 기본 컴포넌트부터 안정적으로 제공하고, 팀이 반복해서 겪는 UI 문제를 먼저 해결했습니다.',
      '문서에서는 코드 예제보다 왜 이런 제약을 두었는지 설명하는 부분이 중요했습니다. 제약의 이유를 이해하면 우회 구현이 줄고 시스템에 대한 신뢰가 더 빨리 생겼습니다.',
      '디자인 시스템은 중앙 조직의 자산이 아니라 팀 전체의 공용 언어가 되어야 오래 갑니다. 그래서 저는 컴포넌트보다 운영 원칙을 먼저 맞추는 편입니다.',
    ],
    publishedAt: '2024-04-14',
    readTime: '7분',
    tags: ['React', 'Design System', 'Storybook'],
    views: 980,
    likes: 73,
    comments: 15,
    featured: true,
    author: getAuthor('park-ui'),
  },
  {
    id: '5',
    slug: 'spring-api-docs-that-team-reads',
    title: '팀이 실제로 읽는 Spring API 문서 만들기',
    excerpt:
      '문서 자동화 도구를 붙이는 것만으로는 부족했습니다. 소비자 입장에서 읽히는 API 문서를 만드는 기준을 정리했습니다.',
    content: [
      'API 문서는 생성하는 것보다 유지되는 것이 더 중요했습니다. 스펙이 바뀔 때마다 문서가 밀리면 팀은 결국 슬랙 메시지와 코드만 믿게 됩니다.',
      '저는 성공 응답보다 실패 케이스를 먼저 문서화했습니다. 프론트엔드가 실제로 궁금해하는 정보는 왜 실패했는지, 어떤 메시지를 보여줘야 하는지에 더 가까웠기 때문입니다.',
      '또한 예시 요청과 응답은 실제 서비스 용어를 사용해 작성했습니다. 추상적인 샘플보다 도메인 문맥이 있는 예제가 훨씬 빠르게 이해됩니다.',
      '좋은 문서는 개발 속도를 올려주는 공통 인터페이스입니다. 문서가 코드보다 뒤처지지 않도록 만드는 것이 운영의 핵심이었습니다.',
    ],
    publishedAt: '2024-03-20',
    readTime: '9분',
    tags: ['Spring', 'Java', 'API'],
    views: 510,
    likes: 36,
    comments: 4,
    featured: false,
    author: getAuthor('lee-backend'),
  },
  {
    id: '6',
    slug: 'neighbor-feed-for-developer-portfolio',
    title: '개발자 포트폴리오 서비스에 이웃 새글 피드 붙이기',
    excerpt:
      '개인의 기록을 넘어 플랫폼 체류 시간을 늘리기 위해 이웃 새글 피드를 어떻게 설계했는지 고민 과정을 공유합니다.',
    content: [
      '포트폴리오 서비스에 블로그를 넣을 때 가장 먼저 고민한 것은 혼자 보는 기록장으로 끝나지 않게 만드는 일이었습니다. 사용자 간 연결점이 있어야 서비스처럼 느껴지기 때문입니다.',
      '이웃 새글 섹션은 단순히 최신 글을 나열하는 대신, 관심 기술 스택이 겹치는 작성자의 글이 먼저 보이도록 설계했습니다. 완벽한 추천 시스템은 아니어도 사용자에게는 충분히 맥락 있는 피드처럼 보였습니다.',
      '또한 카드 정보는 과하게 많지 않게 조정했습니다. 제목, 요약, 태그, 작성자 정도만 보여줘도 클릭 여부를 판단하는 데 충분했고 화면 밀도도 안정적으로 유지됐습니다.',
      '작은 큐레이션만으로도 플랫폼 인상이 크게 달라졌습니다. 콘텐츠 구조는 결국 관계를 설계하는 일과 맞닿아 있다는 점을 다시 확인했습니다.',
    ],
    publishedAt: '2024-04-16',
    readTime: '6분',
    tags: ['Next.js', 'UX', 'Product'],
    views: 720,
    likes: 58,
    comments: 7,
    featured: false,
    author: getAuthor('park-ui'),
  },
]

const MANAGED_POSTS: Record<string, ManagedBlogPost[]> = {
  'kim-dev': [
    { id: '1', title: 'Next.js App Router에서 데이터 흐름 정리하기', status: '게시됨', date: '2024-04-10', views: '1,240' },
    { id: '2', title: 'React 성능 최적화 체크리스트', status: '게시됨', date: '2024-04-05', views: '860' },
    { id: '3', title: 'TypeScript 고급 타입 설계 노트', status: '게시됨', date: '2024-03-28', views: '540' },
    { id: 'draft-1', title: 'Spring Boot 운영 로그 설계 메모', status: '초안', date: '2024-04-18', views: '0' },
  ],
}

function sortByDateDesc<T extends { publishedAt?: string; date?: string }>(items: T[]) {
  return [...items].sort((a, b) => {
    const left = new Date(a.publishedAt ?? a.date ?? '').getTime()
    const right = new Date(b.publishedAt ?? b.date ?? '').getTime()
    return right - left
  })
}

export function getAllBlogPosts() {
  return sortByDateDesc(BLOG_POSTS)
}

export function getBlogPostById(id: string) {
  return BLOG_POSTS.find((post) => post.id === id)
}

export function getBlogPostsByUsername(username: string) {
  return sortByDateDesc(
    BLOG_POSTS.filter((post) => post.author.username === username),
  )
}

export function getPublicProfileByUsername(username: string) {
  return AUTHORS.find((author) => author.username === username)
}

export function getBlogPostSummariesByUsername(username: string) {
  return getBlogPostsByUsername(username).map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    date: post.publishedAt,
    readTime: post.readTime,
  }))
}

export function getManagedBlogPosts(username: string) {
  return sortByDateDesc(MANAGED_POSTS[username] ?? [])
}

export function getPopularBlogPosts(limit = 3) {
  return [...BLOG_POSTS].sort((a, b) => b.views - a.views).slice(0, limit)
}

export function getFeaturedBlogPosts(limit = 3) {
  return sortByDateDesc(BLOG_POSTS.filter((post) => post.featured)).slice(0, limit)
}

export function getNeighborBlogPosts(limit = 4) {
  return getAllBlogPosts()
    .filter((post) => post.author.username !== 'kim-dev')
    .slice(0, limit)
}

export function getBlogTags() {
  return Array.from(new Set(BLOG_POSTS.flatMap((post) => post.tags))).sort()
}

export function getAdjacentPosts(id: string) {
  const posts = getAllBlogPosts()
  const index = posts.findIndex((post) => post.id === id)

  if (index === -1) {
    return { previous: undefined, next: undefined }
  }

  return {
    previous: posts[index + 1],
    next: posts[index - 1],
  }
}

export function getRelatedPosts(post: BlogPost, limit = 3) {
  return getAllBlogPosts()
    .filter(
      (candidate) =>
        candidate.id !== post.id &&
        candidate.tags.some((tag) => post.tags.includes(tag)),
    )
    .slice(0, limit)
}
