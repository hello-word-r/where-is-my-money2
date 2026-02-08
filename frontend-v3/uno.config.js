import { defineConfig, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      primary: '#ff4d4f', // A "roast" red
      secondary: '#1890ff',
      dark: '#141414',
      light: '#f0f2f5',
    },
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      serif: '"EB Garamond", serif',
    },
  },
  shortcuts: {
    'btn-primary': 'px-6 py-3 bg-primary text-white rounded-full font-bold hover:scale-105 transition-transform active:scale-95 cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
    'card': 'bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer',
    'flex-center': 'flex items-center justify-center',
    'page-root': 'min-h-screen bg-light font-sans text-dark flex justify-center items-start md:py-12 px-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]',
    'content-shell': 'w-full max-w-md flex flex-col items-center bg-white md:shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:rounded-4xl overflow-hidden relative min-h-[calc(100vh-2rem)] md:min-h-0 md:border md:border-gray-200',
  },
})
