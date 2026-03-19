export const useSettingsStore = defineStore('settings', () => {
  const theme = useTheme()
  const localStorage = useLocalStorage<{
    items: {
      darkMode: boolean
    }
  }>()

  const darkMode = computed<boolean>({
    get() {
      return theme.global.name.value === 'dark'
    },

    set(val) {
      theme.change(val ? 'dark' : 'light')
    },
  })
  onMounted(async () => {
    darkMode.value = (await localStorage.getItem('darkMode')) || false
  })

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
  }

  watch(darkMode, (val) => {
    localStorage.setItem('darkMode', val)
  })

  return {
    darkMode,
    toggleDarkMode,
  }
})
