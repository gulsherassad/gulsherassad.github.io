import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Shown in the footer as "Updated Nov 14, 2026".
const buildDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).format(new Date());

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
});
