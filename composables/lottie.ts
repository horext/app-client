import Lottie, {
  type AnimationConfigWithData,
  type AnimationConfigWithPath,
  type AnimationItem,
  type RendererType,
} from 'lottie-web'
import type { Ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

export type LottieRef = Ref<ComponentPublicInstance | Element | null>

export type LottieOptions<T extends RendererType = 'svg'> =
  | Omit<AnimationConfigWithData<T>, 'container'>
  | Omit<AnimationConfigWithPath<T>, 'container'>
 
export const getElReference = (reference: LottieRef) => {
  const _reference = reference.value
  return _reference && '$el' in _reference  ? _reference.$el : _reference
}

export const useLottie = <T extends RendererType = 'svg'>(
  reference: LottieRef,
  options: LottieOptions<T>,
) => {
  const lottie = ref<AnimationItem | null>(null)
  onMounted(() => {
    const el = getElReference(reference)
    if (!el) return
    lottie.value = Lottie.loadAnimation<T>({
      ...options,
      container: el,
    })
  })

  return lottie
}
