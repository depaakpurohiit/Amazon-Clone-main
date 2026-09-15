import React from "react";

export const metadata = {
  title: "Privacy Policy | Trade Hive",
  description: "Learn how Trade Hive protects your personal information and privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: September 2026</p>
      </div>

      <div className="space-y-6 text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
          <p>
            When you register, place orders, or browse Trade Hive, we collect information you provide directly, such as your name, email address, phone number, and delivery addresses.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>
            We use your data to process orders, manage deliveries, send OTP authentications via Resend, and improve your shopping experience. We never sell your personal information to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">3. Security</h2>
          <p>
            Your account credentials, addresses, and order histories are encrypted and stored in secure PostgreSQL database infrastructure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">4. Contact Us</h2>
          <p>
            If you have questions about our privacy practices, please reach out through our contact page or email support@tradehive.com.
          </p>
        </section>
      </div>
    </div>
  );
}
