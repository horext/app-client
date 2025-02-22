import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'
export default withNuxt(
  // your custom flat configs go here, for example:
  // {
  //   files: ['**/*.ts', '**/*.tsx'],
  //   rules: {
  //     'no-console': 'off' // allow console.log in TypeScript files
  //   }
  // },
  // {
  //   ...
  // },
  prettier
)
