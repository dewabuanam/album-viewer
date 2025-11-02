import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Roboto, Playfair_Display, Poppins, Lora } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] })
const _playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] })
const _poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })
const _lora = Lora({ subsets: ["latin"], weight: ["400", "500", "700"] })

export const metadata: Metadata = {
  title: "My Personal Life",
  description: "Family, Friends & Hobbies - A personal photo album",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
