
/**
 * @param element {HTMLElement}
 * @return {{top: number, left: number}}
 */
function getOffsetRect (element) {
  const box = element.getBoundingClientRect()

  const scrollTop = window.pageYOffset
  const scrollLeft = window.pageXOffset

  const top = box.top + scrollTop
  const left = box.left + scrollLeft

  return { top: Math.round(top), left: Math.round(left) }
}
/**
 * @param event {MouseEvent}
 * @param element {HTMLElement}
 * @return {{x: number, y: number}}
 */
function getMousePosition (element, event) {
  const mouseX = event.pageX || event.clientX + document.documentElement.scrollLeft
  const mouseY = event.pageY || event.clientY + document.documentElement.scrollTop

  const offset = getOffsetRect(element)
  const x = mouseX - offset.left
  const y = mouseY - offset.top

  return [x, y]
}

export {
  getMousePosition, getOffsetRect
}
