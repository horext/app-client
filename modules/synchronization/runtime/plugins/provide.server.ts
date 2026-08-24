/** Server composition boundary: selects the noop repositories without sync infrastructure. */
export default defineNuxtPlugin({
  name: 'synchronization:provide',
  dependsOn: ['schedules-storage:provide-repos'],
  order: 2,
  setup(nuxtApp) {
    const rawStorage = nuxtApp.$schedulesStorage
    return {
      provide: {
        applicationRepositories: rawStorage,
      },
    }
  },
})
