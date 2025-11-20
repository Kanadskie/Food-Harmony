/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Основные природные тона
        sage: '#88A47C',        // Светлый шалфейный
        sand: '#C4A484',        // Мягкий песочный
        
        // Акцентные тона
        coral: '#FF7F50',       // Энергичный Коралловый
        yellow: '#FFD700',      // Солнечный Желтый
        
        // Нейтральная база
        cream: '#FFFDD0',       // Кремовый
        charcoal: '#4A4A4A',    // Глубокий Серый
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
      boxShadow: {
        'gentle': '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}

