// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Назва вашого репозиторію на GitHub
  base: '/alfa4c/', 

  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  
  // Вказуємо, що статичні файли (моделі, draco) знаходяться в папці public
  publicDir: 'public',
});