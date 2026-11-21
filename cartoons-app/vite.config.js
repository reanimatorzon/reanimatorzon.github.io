import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins:[react()],
  base:'/cartoons/',
  build:{outDir:'../docs/cartoons',emptyOutDir:true}
});
