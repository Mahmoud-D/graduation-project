// src/app/layout.js
 import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Navigation from '@/components/sections/navigation'
 
export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body 
         suppressHydrationWarning={true} // أضف هذه السطر
      >
        <CartProvider>
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  )
}