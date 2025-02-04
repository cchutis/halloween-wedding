# Constantine & Lauren's Halloween Wedding Website

A dark and elegant Halloween-themed wedding website built with Next.js, Material-UI, and Styled Components.

## Features

- Responsive single-page design
- Smooth scrolling navigation
- Dark, moody theme with gold/bronze accents
- Sections for: Hero, About, When/Where, Hotels, and Masquerade Information

## Tech Stack

- Next.js 14
- Material-UI (MUI)
- Styled Components
- TypeScript

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

The website is structured as a single-page application with the following main components:

- `src/app/page.tsx` - Main page component
- `src/app/layout.tsx` - Root layout with theme providers
- `src/components/Navigation.tsx` - Navigation bar
- `src/styles/theme.ts` - MUI theme configuration

## Customization

- Update the theme colors in `src/styles/theme.ts`
- Modify section content in `src/app/page.tsx`
- Add/remove navigation items in `src/components/Navigation.tsx`
