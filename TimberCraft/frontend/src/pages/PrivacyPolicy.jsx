import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            1. Information We Collect
          </h2>
          <p className="text-gray-600 mb-4">
            At TimberCraft, we collect information to provide better services to
            our customers:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>
              Personal information (name, email, phone number) for order
              processing and communication
            </li>
            <li>Shipping and billing addresses for order fulfillment</li>
            <li>
              Payment information (processed securely through our payment
              providers)
            </li>
            <li>Account information for registered users</li>
            <li>
              Product preferences and browsing history to improve your shopping
              experience
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-600 mb-4">
            We use the collected information for:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Processing and fulfilling your orders</li>
            <li>
              Communicating about your orders and custom furniture requests
            </li>
            <li>
              Sending updates about our products and services (with your
              consent)
            </li>
            <li>Improving our website and customer service</li>
            <li>Handling custom furniture inquiries and consultations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
          <p className="text-gray-600">
            We implement appropriate security measures to protect your personal
            information:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
            <li>Secure payment processing through trusted providers</li>
            <li>Encrypted data transmission</li>
            <li>Regular security assessments</li>
            <li>Limited access to personal information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            4. Custom Orders and Consultations
          </h2>
          <p className="text-gray-600">
            For custom furniture orders, we may collect additional information:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-4">
            <li>Design preferences and specifications</li>
            <li>Room measurements and requirements</li>
            <li>Material preferences</li>
            <li>Consultation notes and communication history</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p className="text-gray-600 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent for data processing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p className="text-gray-600">
            For any privacy-related questions or concerns, please contact us at:
          </p>
          <div className="mt-4 text-gray-600">
            <p>Email: support@timbercraft.com</p>
            <p>Phone: +977-980323232</p>
            <p>Address: Kathmandu, Nepal</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            7. Updates to Privacy Policy
          </h2>
          <p className="text-gray-600">
            We may update this privacy policy from time to time. The latest
            version will always be posted on this page with the effective date.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
