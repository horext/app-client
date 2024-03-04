export const useSettingsStore = defineStore('settings', () => {
  const theme = useTheme()
  const localStorage = useLocalStorage()

  const darkMode = computed({
    get(): boolean {
      return theme.global.name.value === 'dark'
    },

    set(val: boolean) {
      theme.global.name.value = val ? 'dark' : 'light'
    },
  })
  onMounted(async () => {
    darkMode.value = (await localStorage.getItem('darkMode')) || false
  })

  watch(darkMode, (val) => {
    localStorage.setItem('darkMode', val)
  })

  return {
    darkMode,
  }
})
