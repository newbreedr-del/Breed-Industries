import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';

export const metadata: Metadata = {
  title: 'Privacy Policy | The Breed Industries',
  description: 'Privacy policy for The Breed Industries web development services and data handling practices.',
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      
      <PageHero
        title="Privacy Policy"
        subtitle="Data Protection"
        description="How we collect, use, and protect your personal information."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Privacy Policy', href: '/privacy-policy' }
        ]}
        size="default"
      />

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Privacy Policy</h2>
              
              <div className="space-y-6 text-white/80">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h3>
                  <p>We collect information you provide directly to us, such as when you contact us for a quote, fill out our contact form, or subscribe to our newsletter. This may include your name, email address, phone number, and business information.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h3>
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Provide our web development and design services</li>
                    <li>Communicate with you about your projects</li>
                    <li>Send you quotes and invoices</li>
                    <li>Respond to your inquiries and requests</li>
                    <li>Improve our services and website functionality</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Information Sharing</h3>
                  <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>With service providers who assist in operating our website (e.g., hosting providers)</li>
                    <li>When required by law or to protect our rights</li>
                    <li>With your explicit consent</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">4. Data Security</h3>
                  <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is stored securely using industry-standard encryption and security protocols.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">5. Cookies and Tracking</h3>
                  <p>Our website may use cookies and similar tracking technologies to enhance your experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">6. Third-Party Services</h3>
                  <p>We use third-party services that may collect information independently:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Google Analytics for website analytics</li>
                    <li>SendGrid for email communications</li>
                    <li>Supabase for database storage</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">7. Your Rights</h3>
                  <p>You have the right to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion of your information</li>
                    <li>Opt out of marketing communications</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">8. Data Retention</h3>
                  <p>We retain your personal information only as long as necessary to fulfill the purposes for which it was collected, unless required by law to retain it longer.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">9. International Data Transfers</h3>
                  <p>Your information may be transferred to and processed in countries other than South Africa. We ensure appropriate safeguards are in place for such transfers.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">10. Children's Privacy</h3>
                  <p>Our services are not intended for children under 18. We do not knowingly collect personal information from children under 18.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">11. Changes to This Policy</h3>
                  <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">12. Contact Us</h3>
                  <p>If you have questions about this privacy policy or your personal information, please contact us at:<br />
                  Email: info@thebreed.co.za<br />
                  Phone: +27 12 345 6789</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-white/60 text-sm">
                  Last updated: March 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
