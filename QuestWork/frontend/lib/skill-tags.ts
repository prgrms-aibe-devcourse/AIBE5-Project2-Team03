export interface SkillTagGroup {
  category: string
  skills: string[]
}

export const SKILL_TAG_GROUPS: SkillTagGroup[] = [
  {
    category: 'Frontend',
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Vue.js',
      'Svelte',
      'Tailwind CSS',
      'Redux',
    ],
  },
  {
    category: 'Backend',
    skills: [
      'Node.js',
      'Spring',
      'Express',
      'Java',
      'Python',
      'Go',
      'NestJS',
      'PHP',
    ],
  },
  {
    category: 'Database',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'Firebase'],
  },
  {
    category: 'Mobile',
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
  },
  {
    category: 'DevOps',
    skills: [
      'Docker',
      'Kubernetes',
      'AWS',
      'Google Cloud',
      'Azure',
      'Jenkins',
      'Terraform',
    ],
  },
  {
    category: 'Other',
    skills: ['Git', 'Figma', 'GraphQL', 'Apollo'],
  },
]

export const ALL_SKILL_TAGS = SKILL_TAG_GROUPS.flatMap((group) => group.skills)
