'use client'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: { light: '#f7fafc', dark: '#1a202c' },
      100: { light: '#edf2f7', dark: '#2d3748' },
      200: { light: '#e2e8f0', dark: '#4a5568' },
      300: { light: '#cbd5e0', dark: '#718096' },
      400: { light: '#a0aec0', dark: '#a0aec0' },
      500: { light: '#718096', dark: '#cbd5e0' },
      600: { light: '#4a5568', dark: '#e2e8f0' },
      700: { light: '#2d3748', dark: '#edf2f7' },
      800: { light: '#1a202c', dark: '#f7fafc' },
      900: { light: '#171923', dark: '#ffffff' },
    },
    accent: {
      500: { light: '#2c7a7b', dark: '#4fd1c5' }, // 确保这里的 light 值是您想要的绿色
      600: { light: '#285e61', dark: '#38b2ac' },
    },
  },
  styles: {
    global: (props: typeof theme) => ({
      body: {
        bg: props.colorMode === 'light' ? 'brand.50.light' : 'brand.50.dark',
        color: props.colorMode === 'light' ? 'brand.800.light' : 'brand.800.dark',
      },
    }),
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  )
}
