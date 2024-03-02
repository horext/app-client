import Lottie, {
  type AnimationConfigWithData,
  type AnimationConfigWithPath,
  type AnimationItem,
  type RendererType,
} from 'lottie-web'

export const useLottie = <T extends RendererType = 'svg'>(
  el: Ref<ComponentPublicInstance | null>,
  options:
    | Omit<AnimationConfigWithData<T>, 'container'>
    | Omit<AnimationConfigWithPath<T>, 'container'>,
) => {
  const lottie = ref<AnimationItem | null>(null)
  onMounted(() => {
    if (!el.value?.$el) return
    lottie.value = Lottie.loadAnimation<T>({
      ...options,
      container: el.value?.$el,
    })
  })

  return { lottie }
}
