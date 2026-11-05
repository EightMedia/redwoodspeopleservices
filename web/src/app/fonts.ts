import { Roboto, Roboto_Slab } from 'next/font/google';

/** Body font (Astro: @fontsource/roboto 400/500/700). */
export const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--rw-font-sans',
});

/** Heading font (Astro: @fontsource/roboto-slab 500/700). */
export const robotoSlab = Roboto_Slab({
  weight: ['500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--rw-font-display',
});
