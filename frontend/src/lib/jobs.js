export function parseRequiredSkills(requiredSkills) {
  if (!requiredSkills) {
    return []
  }

  return requiredSkills
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)
}

export function normalizeSkills(skills) {
  return Array.from(
    new Set(
      skills
        .map((skill) => skill.trim())
        .filter(Boolean),
    ),
  )
}

export function serializeSkills(skills) {
  return normalizeSkills(skills).join(', ')
}

export function formatJobDate(value) {
  if (!value) {
    return 'Just now'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export function getJobDescriptionPreview(description, maxLength = 140) {
  if (!description) {
    return ''
  }

  return description.length > maxLength ? `${description.slice(0, maxLength).trim()}...` : description
}
