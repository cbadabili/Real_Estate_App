
import { Shield, FileText, Users, AlertTriangle, Scale, Clock } from 'lucide-react';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8">
          <div className="text-center mb-8">
            <Scale className="h-12 w-12 text-beedab-blue mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-neutral-900">Terms of Service</h1>
            <p className="text-neutral-600 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-beedab-blue" />
                Acceptance of Terms
              </h2>
              <div className="prose prose-neutral max-w-none">
                <p>
                  By accessing and using BeeDab Real Estate Platform ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4 flex items-center">
                <Users className="h-6 w-6 mr-2 text-beedab-blue" />
                User Accounts
              </h2>
              <div className="prose prose-neutral max-w-none">
                <ul>
                  <li><strong>Registration:</strong> You must provide accurate and complete information when creating an account.</li>
                  <li><strong>Security:</strong> You are responsible for maintaining the confidentiality of your account credentials.</li>
                  <li><strong>Age Requirement:</strong> You must be at least 18 years old to use our services.</li>
                  <li><strong>Account Termination:</strong> We reserve the right to terminate accounts that violate these terms.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4 flex items-center">
                <Shield className="h-6 w-6 mr-2 text-beedab-blue" />
                Property Listings and Services
              </h2>
              <div className="prose prose-neutral max-w-none">
                <h3>Listing Accuracy</h3>
                <ul>
                  <li>Users must provide accurate property information and pricing</li>
                  <li>All property photos must be current and representative</li>
                  <li>False or misleading listings are prohibited</li>
                </ul>
                
                <h3>Service Provider Responsibilities</h3>
                <ul>
                  <li>Service providers must be properly licensed and insured</li>
                  <li>All services must comply with Botswana laws and regulations</li>
                  <li>Professional conduct is required at all times</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-beedab-blue" />
                Prohibited Uses
              </h2>
              <div className="prose prose-neutral max-w-none">
                <p>You agree not to use the service to:</p>
                <ul>
                  <li>Upload false, misleading, or fraudulent content</li>
                  <li>Violate any local, state, national, or international law</li>
                  <li>Transmit any material that is defamatory, offensive, or inappropriate</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper working of the service</li>
                  <li>Use the platform for money laundering or other illegal financial activities</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                Payment and Billing
              </h2>
              <div className="prose prose-neutral max-w-none">
                <ul>
                  <li><strong>Subscription Plans:</strong> Detailed in our pricing page</li>
                  <li><strong>Payment Methods:</strong> Bank transfer, mobile money (as available)</li>
                  <li><strong>Refunds:</strong> Subject to our refund policy</li>
                  <li><strong>Price Changes:</strong> We reserve the right to change pricing with 30 days notice</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                Limitation of Liability
              </h2>
              <div className="prose prose-neutral max-w-none">
                <p>
                  BeeDab provides a platform for connecting buyers, sellers, and service providers. 
                  We are not responsible for the actual transactions, property conditions, or service quality. 
                  Users engage with each other at their own risk and should conduct proper due diligence.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                Intellectual Property
              </h2>
              <div className="prose prose-neutral max-w-none">
                <p>
                  The BeeDab platform, including its design, functionality, and content, is protected by 
                  copyright and other intellectual property laws. Users retain rights to their own content 
                  but grant us a license to display and distribute it through our platform.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-beedab-blue" />
                Changes to Terms
              </h2>
              <div className="prose prose-neutral max-w-none">
                <p>
                  We reserve the right to modify these terms at any time. Users will be notified of 
                  significant changes via email or platform notifications. Continued use of the service 
                  after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                Governing Law
              </h2>
              <div className="prose prose-neutral max-w-none">
                <p>
                  These terms are governed by the laws of Botswana. Any disputes will be resolved 
                  in the courts of Botswana.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                Contact Information
              </h2>
              <div className="prose prose-neutral max-w-none">
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <ul>
                  <li><strong>Email:</strong> legal@beedab.com</li>
                  <li><strong>Phone:</strong> +267 123 4567</li>
                  <li><strong>Address:</strong> Gaborone, Botswana</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
