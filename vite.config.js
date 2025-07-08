import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Explicitly list which env vars we want to expose
  const env = loadEnv(mode, process.cwd(), ['VITE_OPENAI_API_KEY']);

  return {
    base: '/resume-craft/',
    plugins: [react()],
    define: {
      'import.meta.env': env
    },
    css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@ant-prefix': 'antv6',
        },
      },
    },
  }

  };
});