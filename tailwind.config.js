module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'brand-red': '#ff0000',
        'brand-black': '#000000',
        'brand-concrete': '#f2f2f2',
        'brand-blue': '#3285dc',
        // Define semantic colors using brand palette
        'primary': '#ff0000',
        'secondary': '#3285dc',
        'accent': '#3285dc',
        'neutral': '#f2f2f2',
        'base-100': '#ffffff',
        'base-200': '#f2f2f2',
        'base-300': '#e5e5e5',
        'base-content': '#000000',
      },
      fontFamily: {
        'sans': ['Neue Haas Grotesk', 'Helvetica', 'Arial', 'sans-serif'],
        'primary': ['Neue Haas Grotesk', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
