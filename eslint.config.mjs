import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  ignores: ['.next/**'],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'unicorn/no-new-array': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'node/prefer-global/process': 'off',
    'react/no-unstable-context-value': 'off',
    'ts/no-use-before-define': 'off',
  },
})
