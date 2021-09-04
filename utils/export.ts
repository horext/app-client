import XLSX from 'xlsx'
const data: unknown[][] = []
/* convert from array of arrays to workbook */
const worksheet = XLSX.utils.aoa_to_sheet(data)
const newWorkbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'SheetJS')
