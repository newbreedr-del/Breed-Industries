import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHero } from '@/components/layout/PageHero';

export const metadata: Metadata = {
  title: 'Terms of Service | The Breed Industries',
  description: 'Terms and conditions governing all services provided by The Breed Industries (PTY) LTD, including business setup, branding, digital solutions, and the Fresh Start funding programme.',
};

export default function TermsOfServicePage() {
  return (
    <>
      <Header />

      <PageHero
        title="Terms of Service"
        subtitle="Legal Information"
        description="Please read these terms carefully before engaging any of our services."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Terms of Service', href: '/terms-of-service' }
        ]}
        size="default"
      />

      <section className="py-20 bg-color-bg-secondary relative">
        <div className="absolute inset-0 grid-overlay" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto space-y-4">

            {/* Intro card */}
            <div className="glass-card p-8">
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                These Terms of Service govern the relationship between <strong className="text-white">The Breed Industries (PTY) LTD</strong> (referred to as &quot;Breed Industries&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) and any individual or entity (&quot;you&quot; or &quot;the client&quot;) that engages our services.
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                By engaging Breed Industries through any channel - including our website, email, WhatsApp, or verbal agreement - you confirm that you have read and agree to these terms. If you do not agree, please do not proceed with any engagement.
              </p>
            </div>

            {/* Section 1 */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-4">1. Who We Are and What We Do</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Breed Industries is a South African business agency registered as a private company. We provide the following categories of service:
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: 'Business Setup and Compliance',
                    body: 'Company registration (CIPC), tax compliance (SARS), B-BBEE certification, CSD registration, COID and Letters of Good Standing.'
                  },
                  {
                    title: 'Branding and Identity',
                    body: 'Logo design, business branding packages, business cards, flyers, digital artwork, and marketing materials.'
                  },
                  {
                    title: 'Business Documents and Training',
                    body: 'Business profiles, business plans, training workbooks, facilitator guides, and training presentations.'
                  },
                  {
                    title: 'Digital Solutions',
                    body: 'Website development, mobile app development, e-commerce solutions, SEO, and digital marketing.'
                  },
                  {
                    title: 'Fresh Start - Funding Assistance Programme',
                    body: 'A programme that helps entrepreneurs research, apply for, and access government and private funding before building with Breed Industries. This service operates under its own specific terms detailed in Section 6 below.'
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ background: '#FF9F00' }}
                    />
                    <p className="text-white/70 text-sm leading-relaxed">
                      <strong className="text-white">{item.title}:</strong> {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2 */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-4">2. Quotations and Project Agreements</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                All work begins with a written quotation. Quotations are valid for 14 days from the date of issue. Proceeding beyond the quotation stage - whether by paying a deposit or providing written or verbal confirmation - constitutes acceptance of the quoted scope and pricing.
              </p>
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                Any changes to the agreed scope of work after commencement may result in additional charges. We will notify you in writing before any out-of-scope work proceeds.
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                Breed Industries reserves the right to decline any project at our discretion, including after a quotation has been issued.
              </p>
            </div>

            {/* Section 3 */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-4">3. Payment Terms</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                For all standard services, a <strong className="text-white">50% deposit is required before any work commences</strong>. The remaining balance is due upon project completion and before final files or live access are handed over.
              </p>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Monthly retainer services (such as social media management or ongoing SEO) are invoiced at the start of each billing cycle and are due within 5 business days.
              </p>
              <p className="text-white/70 text-sm leading-relaxed mb-2">
                Payment details are as follows:
              </p>
              <div
                className="rounded-lg p-4 text-sm space-y-1"
                style={{ background: 'rgba(255,159,0,0.07)', border: '1px solid rgba(255,159,0,0.2)' }}
              >
                <p className="text-white/80">Bank: <strong className="text-white">Standard Bank</strong></p>
                <p className="text-white/80">Account Name: <strong className="text-white">The Breed Industries (PTY) LTD</strong></p>
                <p className="text-white/80">Account Number: <strong className="text-white">10268731932</strong></p>
                <p className="text-white/80">Branch Code: <strong className="text-white">051001</strong></p>
                <p className="text-white/80">SWIFT: <strong className="text-white">SBZA ZA JJ</strong></p>
              </div>
              <p className="text-white/60 text-xs mt-3">
                Always use your name or invoice number as the payment reference. Send proof of payment to info@thebreed.co.za.
              </p>
            </div>

            {/* Section 4 */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-4">4. Timelines and Delivery</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                Project timelines are agreed upon at the start of each engagement and are documented in the quotation or project brief. These timelines are estimates based on the agreed scope and assume timely feedback and content from the client.
              </p>
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                Delays caused by the client - including late content submission, slow feedback, or changes to the agreed brief - may extend the timeline. Breed Industries will not be held responsible for delays resulting from client-side inaction.
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                We will communicate proactively if any delay arises on our end. Rush requests may be accommodated at an additional fee, subject to availability.
              </p>
            </div>

            {/* Section 5 */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-4">5. Intellectual Property</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                Upon receipt of full and final payment, all intellectual property rights to the delivered work transfer to the client. This includes logos, design files, website code, written content, and any other deliverables produced specifically for the client.
              </p>
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                Until full payment is received, all work remains the property of Breed Industries and may not be used, published, or distributed.
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                Breed Industries retains the right to display completed work in our portfolio and marketing materials unless otherwise agreed in writing.
              </p>
            </div>

            {/* Section 6 - Fresh Start */}
            <div
              className="glass-card p-8"
              style={{ borderColor: 'rgba(255,159,0,0.3)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 rounded" style={{ background: '#FF9F00' }} />
                <h2 className="text-xl font-bold text-white">6. Fresh Start Funding Programme</h2>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                Fresh Start is a specialist service offered by Breed Industries to help entrepreneurs research and apply for government and private funding. The following terms apply specifically to this programme and supplement the general terms above.
              </p>
              <div className="space-y-4">
                {[
                  {
                    heading: '6.1 Commitment Fee',
                    body: 'A once-off fee of R1,000 is required before any research or application work begins. This fee covers the cost of conducting a funding suitability assessment, drafting your application, and engaging with relevant funding agencies on your behalf. The R1,000 commitment fee is non-refundable as a standalone payment. However, if your funding application is approved and you proceed with a Breed Industries service package, the full R1,000 will be deducted from the cost of your chosen package.'
                  },
                  {
                    heading: '6.2 No Guarantee of Funding',
                    body: 'Breed Industries acts as a service provider and facilitator. We do not guarantee that any funding application will be approved. All approval decisions rest entirely with the relevant funding agencies (such as SEDFA, the NYDA, or private funders) based on their own eligibility criteria and internal processes. A declined application does not entitle the client to a refund of the commitment fee.'
                  },
                  {
                    heading: '6.3 No Commission or Percentage of Funds',
                    body: 'Breed Industries does not charge any commission, percentage, or share of funds received by the client. Our only fee under this programme is the R1,000 commitment fee described above. We do not act as a financial intermediary and we do not receive any portion of approved funding from any agency.'
                  },
                  {
                    heading: '6.4 Client Responsibilities',
                    body: 'The client is responsible for providing accurate, complete, and truthful information for use in funding applications. Breed Industries will not be liable for applications that are declined or withdrawn due to inaccurate or incomplete information supplied by the client. Any information found to be false or misleading may result in immediate termination of the service without refund.'
                  },
                  {
                    heading: '6.5 Data Usage',
                    body: 'Personal and business information collected during the Fresh Start process will be used solely for the purpose of researching suitable funding programmes and preparing funding applications. Your information will be shared only with the relevant funding agencies you have been matched with, and with no other third parties. All information is handled in accordance with the Protection of Personal Information Act (POPIA).'
                  },
                  {
                    heading: '6.6 Timeline',
                    body: 'The timeline for funding applications varies by institution. Government programmes such as SEDFA and NYDA typically take between 4 and 12 weeks to process applications. Breed Industries will provide realistic timeline expectations at the start of each engagement but cannot be held responsible for processing delays on the part of funding agencies.'
                  },
                ].map((item) => (
                  <div key={item.heading}>
                    <h3 className="text-white font-semibold text-sm mb-1">{item.heading}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 7 */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-4">7. Confidentiality</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                Breed Industries treats all client information, business plans, financial details, and project specifics as strictly confidential. No client data will be disclosed to any third party without your explicit written consent, except where required by law or where necessary to deliver the agreed service (for example, sharing application documents with a funding agency in the context of Fresh Start).
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                This obligation of confidentiality survives the termination of any service agreement.
              </p>
            </div>

            {/* Section 8 */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-4">8. Client Conduct and Responsibilities</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                Clients are expected to engage with Breed Industries in good faith, provide accurate information, respond to communications in a reasonable time, and supply any content or materials required for the project within the agreed timeframe.
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                Breed Industries reserves the right to pause or terminate a project if the client behaves in a manner that is abusive, dishonest, or obstructive. In such cases, any deposit paid will not be refunded.
              </p>
            </div>

            {/* Section 9 */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                To the maximum extent permitted by South African law, Breed Industries will not be liable for any indirect, special, incidental, or consequential loss or damage arising from the use of our services or from any failure to deliver within an estimated timeline.
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                Our total liability for any claim arising from a specific project or service will not exceed the total amount paid by the client for that specific project or service.
              </p>
            </div>

            {/* Section 10 */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-4">10. Cancellation and Termination</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-3">
                Either party may cancel a project with written notice. If the client cancels after a deposit has been paid and work has commenced, the deposit is non-refundable. If Breed Industries has completed more than 50% of the agreed scope at the time of cancellation, the full project fee may be invoiced.
              </p>
              <p className="text-white/70 text-sm leading-relaxed">
                If Breed Industries cancels a project for reasons unrelated to client conduct, any deposit paid for work not yet started will be refunded within 14 business days.
              </p>
            </div>

            {/* Section 11 */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-4">11. Governing Law</h2>
              <p className="text-white/70 text-sm leading-relaxed">
                These terms are governed by the laws of the Republic of South Africa. This includes but is not limited to the Consumer Protection Act 68 of 2008, the Electronic Communications and Transactions Act 25 of 2002, and the Protection of Personal Information Act 4 of 2013 (POPIA). Any disputes arising from these terms will be subject to the jurisdiction of the South African courts.
              </p>
            </div>

            {/* Section 12 */}
            <div className="glass-card p-8">
              <h2 className="text-xl font-bold text-white mb-4">12. Contact Us</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                If you have any questions about these terms or wish to raise a concern, please contact us directly:
              </p>
              <div className="space-y-1 text-sm">
                <p className="text-white/80">Company: <strong className="text-white">The Breed Industries (PTY) LTD</strong></p>
                <p className="text-white/80">Address: <strong className="text-white">12 Kings Road, Pinetown, Durban, 3610</strong></p>
                <p className="text-white/80">Email: <strong className="text-white">info@thebreed.co.za</strong></p>
                <p className="text-white/80">Phone: <strong className="text-white">+27 60 496 4105</strong></p>
                <p className="text-white/80">Website: <strong className="text-white">www.thebreed.co.za</strong></p>
              </div>
            </div>

            {/* Footer note */}
            <div className="glass-card p-6">
              <p className="text-white/50 text-xs leading-relaxed">
                Last updated: May 2026. Breed Industries reserves the right to update these terms at any time. Continued use of our services following an update constitutes acceptance of the revised terms.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
