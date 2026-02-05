// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Назва вашого репозиторію на GitHub
  base: '/blazerInkBuiltDemo/', 

  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  
  // Вказуємо, що статичні файли (моделі, draco) знаходяться в папці public
  publicDir: 'public',
});