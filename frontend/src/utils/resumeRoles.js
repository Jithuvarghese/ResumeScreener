export const RESUME_ROLES = [
  {
    value: 'frontend-developer',
    label: 'Frontend Developer',
    primarySkills: ['React', 'JavaScript', 'HTML', 'CSS'],
    secondarySkills: ['TypeScript', 'Redux', 'Next.js'],
    tools: ['Vite', 'Webpack', 'Storybook'],
    softSkills: ['Design systems', 'Accessibility', 'Collaboration'],
    keywords: ['ui', 'frontend', 'web', 'component'],
    description: 'UI engineering, component systems, and browser-focused delivery.',
  },
  {
    value: 'backend-developer',
    label: 'Backend Developer',
    primarySkills: ['Node.js', 'Java', 'Spring'],
    secondarySkills: ['Express', 'Hibernate', 'SQL'],
    tools: ['Docker', 'Postman', 'Redis'],
    softSkills: ['System design', 'APIs', 'Debugging'],
    keywords: ['api', 'backend', 'service', 'microservice'],
    description: 'Server-side services, APIs, data access, and business logic.',
  },
  {
    value: 'devops-engineer',
    label: 'DevOps Engineer',
    primarySkills: ['Docker', 'Kubernetes', 'CI/CD'],
    secondarySkills: ['Terraform', 'Prometheus'],
    tools: ['AWS', 'Helm', 'Jenkins'],
    softSkills: ['Automation', 'Reliability', 'Monitoring'],
    keywords: ['infrastructure', 'deployment', 'ops'],
    description: 'Infrastructure automation, deployment pipelines, and operational reliability.',
  },
  {
    value: 'data-scientist',
    label: 'Data Scientist',
    primarySkills: ['Python', 'Pandas', 'Machine Learning'],
    secondarySkills: ['TensorFlow', 'PyTorch', 'Scikit-learn'],
    tools: ['Jupyter', 'Docker', 'MLflow'],
    softSkills: ['Feature engineering', 'Statistics'],
    keywords: ['data', 'ml', 'modeling', 'analysis'],
    description: 'Data modeling, analysis and machine learning systems.',
  },
];

export function getRoleByValue(roleValue) {
  return RESUME_ROLES.find((role) => role.value === roleValue) ?? RESUME_ROLES[0];
}

export function getRoleLabels() {
  return RESUME_ROLES.map(({ value, label }) => ({ value, label }));
}

export function flattenRoleSkills(role) {
  if (!role) return [];
  return [
    ...(role.primarySkills || []),
    ...(role.secondarySkills || []),
    ...(role.tools || []),
    ...(role.softSkills || []),
    ...(role.keywords || []),
  ];
}