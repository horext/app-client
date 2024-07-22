export const getSectionColor = (id: string) => {
    const colors = [
      'primary',
      'secondary',
      'accent',
      'error',
      'info',
      'success',
      'warning',
    ]
  
    return colors[id.length % colors.length]
  }