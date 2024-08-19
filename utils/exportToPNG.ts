import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'


export const exportToCanvas = async function (element: HTMLElement) {
  let options: any = {
    logging: true,
    scrollX: 0,
    scrollY: 0,
    removeContainer: true,
  }
  if (element.clientHeight > element.clientWidth) {
    options = {
      logging: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.clientHeight * (4 / 3),
      width: element.clientHeight * (4 / 3),
      removeContainer: true,
    }
  }
  return await html2canvas(element, options)
}
export const exportToPDF = async function (element: HTMLElement | null) {
  if (!element) throw new Error('Element not found')
  const canvas = await exportToCanvas(element)
  const imgData: string | HTMLImageElement | HTMLCanvasElement | Uint8Array =
    canvas.toDataURL('image/jpeg')
  const doc = new JsPDF({
    orientation: 'l',
    unit: 'px',
    format: [canvas.width * 0.71, canvas.height * 0.71],
  })
  doc.addImage(imgData, 'PNG', 0, 0, canvas.width * 0.71, canvas.height * 0.71)

  doc.save('Horario ' + Date.now() + ' - Octatec .pdf')
}

export const exportToPNG = async function (element: HTMLElement) {
  const canvas = await exportToCanvas(element)
  const a = document.createElement('a')
  a.href = canvas.toDataURL('image/jpeg')
  a.download = 'Horario ' + Date.now() + ' - Octatec .jpg'
  a.click()
}
