import Lottie, {
  type AnimationConfigWithData,
  type AnimationConfigWithPath,
  type AnimationItem,
  type RendererType,
} from 'lottie-web'

export const useLottie = <T extends RendererType = 'svg'>(
  reference: Ref<ComponentPublicInstance | Element | null>,
  options:
    | Omit<AnimationConfigWithData<T>, 'container'>
    | Omit<AnimationConfigWithPath<T>, 'container'>,
) => {
  const lottie = ref<AnimationItem | null>(null)
  onMounted(() => {
    const _reference = reference.value
    if (!_reference) return
    const el = '$el' in _reference ? _reference.$el : _reference
    lottie.value = Lottie.loadAnimation<T>({
      ...options,
      container: el,
    })
  })

  return lottie
}
