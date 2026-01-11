import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { Stats } from '@/components/stats';
import { Services } from '@/components/services';
import { Packages } from '@/components/packages';
import { PackageBuilder } from '@/components/package-builder';
import { ClientGallery } from '@/components/client-gallery';
import { Team } from '@/components/team';
import { Benefits } from '@/components/benefits';
import { Cta } from '@/components/cta';
import { Footer } from '@/components/footer';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Packages />
        <PackageBuilder />
        <ClientGallery />
        <Team />
        <Benefits />
        <Cta />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
