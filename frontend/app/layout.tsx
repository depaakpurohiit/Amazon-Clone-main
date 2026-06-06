import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { HomeDataProvider } from "@/context/HomeDataContext";
import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Bloom E-Commerce Template",
  description:
    "Discover a wide selection of trendy clothes, shoes and accessories on Bloom E-Commerce. Enjoy fast delivery and free returns. Shop now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased flex flex-col min-h-screen"
      >
        <CartProvider>
          <FavoritesProvider>
            <HomeDataProvider>
              <Suspense fallback={<div className="h-[72px] border-b border-border bg-background" />}>
                <Header />
              </Suspense>
              <main className="flex-grow">{children}</main>
              <Footer />
            </HomeDataProvider>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
