import React from "react";

export const metadata = {
  title: "Cookie Policy | Trade Hive",
  description: "Understand how Trade Hive uses cookies to enhance your browsing experience.",
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: September 2026</p>
      </div>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">1. What are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit websites. They help websites remember preferences, shopping cart items, and authentication sessions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">2. Cookies We Use</h2>
          <p>
            We use strictly necessary cookies for session management (such as keeping you logged in), preference cookies (like remembering your theme or delivery address), and performance cookies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">3. Managing Cookies</h2>
          <p>
            You can control or disable cookies through your browser settings. Note that disabling cookies may affect your ability to log in or maintain items in your shopping cart.
          </p>
        </section>
      </div>
    </div>
  );
}
