export default {
  '*.{js,jsx}': ['eslint --max-warnings 0', 'prettier --write'],
  '*.{css,html,json,jsonc,md,yml}': 'prettier --write',
};
