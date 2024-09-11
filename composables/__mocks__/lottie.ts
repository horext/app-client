import type { RendererType } from 'lottie-web'
import { vi } from 'vitest'

export const useLottie = vi.fn(
  <T extends RendererType = 'svg'>(
    reference: LottieRef,
    _options: LottieOptions<T>,
  ) => {
    onMounted(() => {
      const el = getElReference(reference)
      if (!el) return
      el.innerHTML = 'Lottie animation'
    })

    return {}
  },
)
