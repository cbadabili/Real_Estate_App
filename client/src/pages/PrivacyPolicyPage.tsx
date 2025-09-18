
import React from 'react';
import { Shield, Eye, Lock, Users, Database, Phone } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-beedab-blue mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-neutral-900">Privacy Policy</h1>
            <p className="text-neutral-600 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4 flex items-center">
                <Eye className="h-6 w-6 mr-2 text-beedab-blue" />
                Information We Collect
              </h2>
              <div className="prose prose-neutral max-w-none">
                <h3>Personal Information</h3>
                <ul>
                  <li><strong>Account Data:</strong> Name, email address, phone number, user type</li>
                  <li><strong>Property Information:</strong> Listings, photos, location data, preferences</li>
                  <li><strong>Communication Data:</strong> Messages, inquiries, appointment requests</li>
                  <li><strong>Usage Data:</strong> Search history, viewed properties, favorites</li>
                </ul>

                <h3>Automatically Collected Information</h3>
                <ul>
                  <li><strong>Device Information:</strong> IP address, browser type, device identifiers</li>
                  <li><strong>Location Data:</strong> Approximate location for map features (with consent)</li>
                  <li><strong>Analytics:</strong> Page views, feature usage, performance metrics</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4 flex items-center">
                <Database className="h-6 w-6 mr-2 text-beedab-blue" />
                How We Use Your Information
              </h2>
              <div className="prose prose-neutral max-w-none">
                <h3>Lawful Basis (Botswana DPA Compliance)</h3>
                <ul>
                  <li><strong>Contract Performance:</strong> Property transactions, user account management</li>
                  <li><strong>Legitimate Interest:</strong> Platform improvement, fraud prevention</li>
                  <li><strong>Consent:</strong> Marketing communications, location services</li>
                  <li><strong>Legal Obligation:</strong> Record keeping, regulatory compliance</li>
                </ul>

                <h3>Specific Uses</h3>
                <ul>
                  <li>Facilitate property listings and transactions</li>
                  <li>Connect buyers with sellers and agents</li>
                  <li>Provide location-based search results</li>
                  <li>Send relevant property alerts and updates</li>
                  <li>Improve our services and user experience</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4 flex items-center">
                <Users className="h-6 w-6 mr-2 text-beedab-blue" />
                Information Sharing
              </h2>
              <div className="prose prose-neutral max-w-none">
                <p>We share your information only in these circumstances:</p>
                <ul>
                  <li><strong>With Your Consent:</strong> Property inquiries shared with relevant agents/sellers</li>
                  <li><strong>Service Providers:</strong> Technical infrastructure, payment processing</li>
                  <li><strong>Legal Requirements:</strong> Court orders, government requests</li>
                  <li><strong>Business Transfers:</strong> Mergers, acquisitions (with notice)</li>
                </ul>
                
                <p><strong>We never:</strong></p>
                <ul>
                  <li>Sell your personal data to third parties</li>
                  <li>Share sensitive data without explicit consent</li>
                  <li>Use your data for unrelated purposes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4 flex items-center">
                <Lock className="h-6 w-6 mr-2 text-beedab-blue" />
                Your Rights Under Botswana DPA
              </h2>
              <div className="prose prose-neutral max-w-none">
                <p>You have the following rights regarding your personal data:</p>
                <ul>
                  <li><strong>Access:</strong> Request copies of your personal data</li>
                  <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Erasure:</strong> Request deletion of your data (right to be forgotten)</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                  <li><strong>Portability:</strong> Receive your data in a structured format</li>
                  <li><strong>Objection:</strong> Object to processing based on legitimate interest</li>
                  <li><strong>Withdraw Consent:</strong> Revoke consent for marketing or location services</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                Data Security & Retention
              </h2>
              <div className="prose prose-neutral max-w-none">
                <h3>Security Measures</h3>
                <ul>
                  <li>Encrypted data transmission (HTTPS)</li>
                  <li>Secure authentication with JWT tokens</li>
                  <li>Regular security updates and monitoring</li>
                  <li>Limited access on a need-to-know basis</li>
                </ul>

                <h3>Data Retention</h3>
                <ul>
                  <li><strong>Account Data:</strong> Retained while account is active + 3 years</li>
                  <li><strong>Property Listings:</strong> Retained for legal/tax purposes (7 years)</li>
                  <li><strong>Communication Data:</strong> Retained for 2 years for support purposes</li>
                  <li><strong>Analytics Data:</strong> Anonymized after 18 months</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4 flex items-center">
                <Phone className="h-6 w-6 mr-2 text-beedab-blue" />
                Contact Information
              </h2>
              <div className="prose prose-neutral max-w-none">
                <p>For privacy-related questions or to exercise your rights:</p>
                <div className="bg-neutral-50 p-4 rounded-lg mt-4">
                  <p><strong>Data Protection Officer</strong></p>
                  <p>Email: privacy@beedab.co.bw</p>
                  <p>Address: [Your Business Address], Botswana</p>
                  <p>Phone: [Your Contact Number]</p>
                </div>

                <p className="mt-4">
                  You also have the right to lodge a complaint with the Botswana Communications 
                  Regulatory Authority (BOCRA) if you believe we have not handled your personal 
                  data in accordance with the Data Protection Act.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                Changes to This Policy
              </h2>
              <div className="prose prose-neutral max-w-none">
                <p>
                  We may update this privacy policy from time to time. We will notify you of 
                  significant changes by email or through our platform. Your continued use of 
                  our services after changes take effect constitutes acceptance of the updated policy.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
