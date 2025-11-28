export const getSectionColor = (id: string) => {
  const colors = ['blue', 'purple', 'orange', 'indigo', 'teal']
  return colors[id.charCodeAt(0) % colors.length]
}
