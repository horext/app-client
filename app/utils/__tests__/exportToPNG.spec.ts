import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { exportToCanvas, exportToPDF, exportToPNG } from '../exportToPNG'

import html2canvas from 'html2canvas-pro'

// ---- mock html2canvas-pro ----
vi.mock('html2canvas-pro', () => ({
  default: vi.fn(),
}))

// ---- mock jspdf ----
const { mockDoc } = vi.hoisted(() => ({
  mockDoc: {
    addImage: vi.fn(),
    save: vi.fn(),
  },
}))

vi.mock('jspdf', () => ({
  default: function MockJsPDF() {
    return mockDoc
  },
}))

const mockCanvas = {
  toDataURL: vi.fn(() => 'data:image/jpeg;base64,abc'),
  width: 800,
  height: 600,
  clientWidth: 800,
  clientHeight: 600,
}

beforeEach(() => {
  vi.mocked(html2canvas).mockResolvedValue(
    mockCanvas as unknown as HTMLCanvasElement,
  )
  mockCanvas.toDataURL.mockReturnValue('data:image/jpeg;base64,abc')
  mockDoc.addImage.mockClear()
  mockDoc.save.mockClear()
})

afterEach(() => {
  vi.clearAllMocks()
})

function makeElement(width = 400, height = 300): HTMLElement {
  const el = document.createElement('div')
  Object.defineProperty(el, 'clientWidth', { value: width, configurable: true })
  Object.defineProperty(el, 'clientHeight', {
    value: height,
    configurable: true,
  })
  return el
}

describe('exportToCanvas', () => {
  it('calls html2canvas with logging and scroll options', async () => {
    const el = makeElement(400, 300) // wider than tall
    await exportToCanvas(el)
    expect(html2canvas).toHaveBeenCalledWith(
      el,
      expect.objectContaining({
        logging: true,
        scrollX: 0,
        scrollY: 0,
        removeContainer: true,
      }),
    )
  })

  it('adds windowWidth and width options when element is taller than wide', async () => {
    const el = makeElement(300, 400) // taller than wide
    await exportToCanvas(el)
    expect(html2canvas).toHaveBeenCalledWith(
      el,
      expect.objectContaining({
        windowWidth: expect.any(Number),
        width: expect.any(Number),
      }),
    )
  })

  it('returns the canvas from html2canvas', async () => {
    const el = makeElement(400, 300)
    const result = await exportToCanvas(el)
    expect(result).toBe(mockCanvas)
  })
})

describe('exportToPDF', () => {
  it('throws when element is null', async () => {
    await expect(exportToPDF(null)).rejects.toThrow('Element not found')
  })

  it('creates a PDF and saves it', async () => {
    const el = makeElement(400, 300)
    await exportToPDF(el)
    expect(mockDoc.addImage).toHaveBeenCalled()
    expect(mockDoc.save).toHaveBeenCalled()
  })

  it('saves with a filename containing "Horario" and "Octatec"', async () => {
    const el = makeElement(400, 300)
    await exportToPDF(el)
    const saveArg: string = mockDoc.save.mock.calls[0]?.[0]
    expect(saveArg).toContain('Horario')
    expect(saveArg).toContain('Octatec')
  })
})

describe('exportToPNG', () => {
  let clickSpy: ReturnType<typeof vi.spyOn>
  let _appendSpy: ReturnType<typeof vi.spyOn>
  let _removeSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    const anchor = document.createElement('a')
    vi.spyOn(document, 'createElement').mockReturnValue(anchor)
    clickSpy = vi.spyOn(anchor, 'click').mockImplementation(() => {})
    _appendSpy = vi
      .spyOn(document.body, 'appendChild')
      .mockImplementation((node) => node)
    _removeSpy = vi
      .spyOn(document.body, 'removeChild')
      .mockImplementation((node) => node)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('throws when element is null', async () => {
    await expect(exportToPNG(null)).rejects.toThrow('Element not found')
  })

  it('creates a download anchor and triggers a click', async () => {
    const el = makeElement(400, 300)
    await exportToPNG(el)
    expect(clickSpy).toHaveBeenCalled()
  })

  it('sets download filename containing "Horario" and "Octatec"', async () => {
    const anchor = document.createElement('a')
    vi.spyOn(document, 'createElement').mockReturnValue(anchor)
    vi.spyOn(anchor, 'click').mockImplementation(() => {})
    const el = makeElement(400, 300)
    await exportToPNG(el)
    expect(anchor.download).toMatch(/Horario/)
    expect(anchor.download).toMatch(/Octatec/)
  })
})
