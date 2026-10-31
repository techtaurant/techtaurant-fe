import betterTailwindcss from 'eslint-plugin-better-tailwindcss';

export const tailwindConfig = {
  files: ['src/**/*.{js,jsx,ts,tsx,mjs,mts}'],
  plugins: {
    'better-tailwindcss': betterTailwindcss,
  },
  settings: {
    'better-tailwindcss': {
      entryPoint: 'src/app/globals.css',
      rootFontSize: 16,
    },
  },
  rules: {
    'better-tailwindcss/enforce-canonical-classes': ['warn', { collapse: true }],
  },
};
