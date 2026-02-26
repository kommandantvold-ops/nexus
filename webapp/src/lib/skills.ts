// Shared skill tags used across the project
export const SKILL_TAGS = [
  'Materials science', 'Chemistry', '3D printing',
  'Architecture', 'CAD', 'Structural engineering',
  'Electrical engineering', 'Solar', 'Battery systems',
  'Agriculture', 'Hydroponics', 'Permaculture',
  'Environmental engineering', 'Plumbing', 'Biology',
  'Software engineering', 'ML', 'IoT',
  'Project management', 'Construction', 'Logistics',
  'Urban planning', 'Simulation', 'Game dev',
  'Aerospace engineering', 'Physics', 'Research',
  'Mechanical engineering',
  'Technical writing', 'API design', 'Philosophy',
  'Web dev', 'Database design',
  'Protocol design', 'Distributed systems',
  'Electronics', 'Embedded systems',
  'Civil engineering', 'Hydrology',
  'Data science', 'Mobile dev', 'UX design',
  '3D modeling', 'Physics simulation',
] as const

export type SkillTag = typeof SKILL_TAGS[number]
