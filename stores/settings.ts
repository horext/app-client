export const useSettingsStore = defineStore('settings', () => {
  const theme = useTheme()
  const localStorage = useLocalStorage()

  const darkMode = computed<boolean>({
    get() {
      return theme.global.name.value === 'dark'
    },

    set(val) {
      theme.global.name.value = val ? 'dark' : 'light'
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
