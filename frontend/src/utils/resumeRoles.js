export const RESUME_ROLES = [
  {
    value: 'frontend-developer',
    label: 'Frontend Developer',
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Redux'],
    description: 'UI engineering, component systems, and browser-focused delivery.',
  },
  {
    value: 'backend-developer',
    label: 'Backend Developer',
    skills: ['Node.js', 'Java', 'Spring', 'SQL', 'API'],
    description: 'Server-side services, APIs, data access, and business logic.',
  },
  {
    value: 'devops-engineer',
    label: 'DevOps Engineer',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'],
    description: 'Infrastructure automation, deployment pipelines, and operational reliability.',
  },
];

export function getRoleByValue(roleValue) {
  return RESUME_ROLES.find((role) => role.value === roleValue) ?? RESUME_ROLES[0];
}

export function getRoleLabels() {
  return RESUME_ROLES.map(({ value, label }) => ({ value, label }));
}