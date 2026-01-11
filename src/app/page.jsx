import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { Stats } from '@/components/stats';
import { About } from '@/components/about';
import { Services } from '@/components/services';
import { Packages } from '@/components/packages';
import { PackageBuilder } from '@/components/package-builder';
import { ClientGallery } from '@/components/client-gallery';
import { Team } from '@/components/team';
import { Benefits } from '@/components/benefits';
import { Cta } from '@/components/cta';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <About />
        <Services />
        <Packages />
        <PackageBuilder />
        <ClientGallery />
        <Team />
        <Benefits />
        <Cta />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
