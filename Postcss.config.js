// postcss.config.js
// ✅ FIX: Use 'tailwindcss' and 'autoprefixer' as plain strings for Tailwind CSS v3.
// The error "moved to a separate package" occurs when you accidentally install
// Tailwind v4 which requires @tailwindcss/postcss. This config works with v3.x
// which is what your package.json (tailwindcss ^3.4.x) uses.

export default {
  plugins: {
    tailwindcss:  {},
    autoprefixer: {},
  },
}