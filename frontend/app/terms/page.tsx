import React from "react";

export const metadata = {
  title: "Terms & Conditions | Trade Hive",
  description: "Read the terms of service and conditions for using the Trade Hive marketplace.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Terms & Conditions</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: September 2026</p>
      </div>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Trade Hive, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">2. Marketplace Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">3. Orders and Payments</h2>
          <p>
            All purchases are subject to product availability and confirmation of order prices. We reserve the right to cancel any order in the event of technical errors or stock unavailability.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">4. Seller Responsibilities</h2>
          <p>
            Sellers must provide accurate product descriptions, adhere to marketplace pricing standards, and ship goods promptly upon order confirmation.
          </p>
        </section>
      </div>
    </div>
  );
}
