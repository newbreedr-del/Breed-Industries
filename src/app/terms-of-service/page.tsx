import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';

export const metadata: Metadata = {
  title: 'Terms of Service | The Breed Industries',
  description: 'Terms of service and conditions for The Breed Industries web development services.',
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      
      <PageHero
        title="Terms of Service"
        subtitle="Legal Information"
        description="Terms and conditions for using our web development services."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Terms of Service', href: '/terms-of-service' }
        ]}
        size="default"
      />

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Terms of Service</h2>
              
              <div className="space-y-6 text-white/80">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">1. Services</h3>
                  <p>The Breed Industries provides web development, design, and digital marketing services to clients throughout South Africa and internationally.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">2. Payment Terms</h3>
                  <p>A 50% deposit is required before any work commences. The remaining balance is due upon project completion.</p>
                  <p>Bank: Standard Bank<br />
                  Account: The Breed Industries (PTY) LTD<br />
                  Account Number: 10268731932<br />
                  Branch Code: 051001<br />
                  SWIFT: SBZA ZA JJ</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">3. Project Timeline</h3>
                  <p>Project timelines are estimates based on project scope and complexity. Delays may occur due to client feedback, content availability, or technical challenges.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">4. Intellectual Property</h3>
                  <p>Upon full payment, all intellectual property rights to the delivered work transfer to the client. The Breed Industries retains the right to display the work in our portfolio.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">5. Confidentiality</h3>
                  <p>We maintain strict confidentiality of all client information and project details. No client data will be shared with third parties without explicit consent.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">6. Limitation of Liability</h3>
                  <p>The Breed Industries shall not be liable for any indirect, special, or consequential damages resulting from the use of our services.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">7. Termination</h3>
                  <p>Either party may terminate the agreement with written notice. Deposits are non-refundable for work already completed.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">8. Governing Law</h3>
                  <p>These terms are governed by the laws of South Africa. Any disputes will be resolved through South African courts.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">9. Contact Information</h3>
                  <p>For questions about these terms, contact us at:<br />
                  Email: info@thebreed.co.za<br />
                  Phone: +27 12 345 6789</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">10. Acceptance</h3>
                  <p>By engaging our services, you agree to these terms and conditions.</p>
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
