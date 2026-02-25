'use client';

import Image from "next/image";
import Link from "next/link";
import { landingConfig } from "./landing-config";

const monoFont = { fontFamily: 'var(--font-mono), monospace' };
const sansFont = { fontFamily: 'var(--font-sans), sans-serif' };

export default function LandingPage() {
  const { brand, nav, hero, features, pricing, faq, cta, footer } = landingConfig;

  return (
    <main className="min-h-screen bg-landing-bg text-landing-fg selection:bg-landing-accent selection:text-landing-bg">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-landing-bg/90 backdrop-blur-sm border-b border-landing-border">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-landing-accent text-xl">{brand.logo}</span>
              <span 
                className="text-xl font-bold tracking-tight text-landing-fg group-hover:text-landing-accent transition-colors"
                style={monoFont}
              >
                {brand.name}
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-12">
              {nav.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-base text-landing-muted hover:text-landing-fg transition-colors"
                  style={sansFont}
                >
                  {link.text}
                </Link>
              ))}
            </div>

            <Link
              href={nav.cta.href}
              className="px-5 py-2 rounded-lg bg-landing-accent text-landing-bg text-sm font-semibold hover:bg-landing-accent/90 transition-colors"
              style={monoFont}
            >
              {nav.cta.text}
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-16 border-b border-landing-border overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#00d4ff10 1px, transparent 1px), linear-gradient(90deg, #00d4ff10 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="space-y-8 max-w-xl">
              <div className="inline-flex items-center rounded-full gap-2 px-3 py-1.5 border border-landing-border-muted bg-landing-border-muted/50">
                <div className="w-1.5 h-1.5 bg-landing-accent rounded-full animate-pulse" />
                <div 
                  className="text-xs font-medium uppercase tracking-wider text-landing-muted"
                  style={monoFont}
                >
                  {hero.badge}
                </div>
              </div>

              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1]"
                style={monoFont}
              >
                {hero.headline}
              </h1>

              <p 
                className="text-lg leading-relaxed text-landing-muted"
                style={sansFont}
              >
                {hero.subheadline}
              </p>

              <Link
                href={hero.cta.href}
                className="inline-flex items-center rounded-lg gap-3 px-8 py-4 bg-landing-accent text-landing-bg font-bold text-sm tracking-wider uppercase hover:bg-landing-accent/90 transition-all duration-200"
                style={monoFont}
              >
                {hero.cta.text}
                <span>→</span>
              </Link>
            </div>

            <div className="relative h-[500px] lg:h-[600px] w-full hidden lg:block">
              <div className="absolute top-0 right-0 w-[520px] h-[220px] opacity-40 transition-opacity duration-500 hover:opacity-70">
                <div className="absolute inset-0 border border-landing-border-light" />
                <Image src={features.items[0].image} alt="GEX Chart" fill className="object-cover" />
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[240px] opacity-50 transition-opacity duration-500 hover:opacity-80">
                <div className="absolute inset-0 border border-landing-border-light" />
                <Image src={features.items[1].image} alt="Net GEX Chart" fill className="object-cover" />
              </div>

              <div className="absolute bottom-8 left-0 w-[500px] h-[200px] opacity-60 transition-opacity duration-500 hover:opacity-90">
                <div className="absolute inset-0 border border-landing-border-light" />
                <Image src={features.items[2].image} alt="OTM Greeks Chart" fill className="object-cover" />
              </div>

              {/* <div className="absolute top-20 left-20 w-20 h-px bg-landing-accent/20" />
              <div className="absolute top-20 left-20 w-px h-20 bg-landing-accent/20" /> */}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 lg:py-32 border-b border-landing-border">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-20 text-center"
            style={monoFont}
          >
            {features.sectionTitle}
          </h2>

          <div className="space-y-24">
            {features.items.map((feature, index) => (
              <div 
                key={index} 
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-start`} //${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}
              >
                <div className={`space-y-6 mt-4`}> {/* ${index % 2 === 1 ? 'lg:order-2' : ''} */}
                  <div 
                    className="text-5xl font-bold text-landing-border-muted"
                    style={monoFont}
                  >
                    0{index + 1}
                  </div>
                  
                  <h3 
                    className="text-2xl md:text-3xl font-bold"
                    style={monoFont}
                  >
                    {feature.title}
                  </h3>
                  
                  <p 
                    className="text-lg leading-relaxed text-landing-muted"
                    style={sansFont}
                  >
                    {feature.description}
                  </p>
                </div>

                <div className={`relative h-[300px] w-full ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="absolute inset-0 border border-landing-border-light" />
                  <div className="absolute inset-0 bg-gradient-to-l from-landing-bg/80 to-transparent z-10 hover:bg-none transition-all duration-300 " />
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover object-left opacity-70"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION - HORIZONTAL */}
      <section id="pricing" className="py-24 lg:py-32 border-b border-landing-border">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-16 text-center"
            style={monoFont}
          >
            {pricing.sectionTitle}
          </h2>

          <div className="border border-landing-border-light bg-[#0d0d0d]">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-landing-border-light">
                <div 
                  className="inline-block px-3 py-1 mb-6 text-xs uppercase tracking-wider text-landing-muted border border-landing-border-muted"
                  style={monoFont}
                >
                  {pricing.badge}
                </div>

                <div className="mb-6">
                  <span 
                    className="text-6xl font-bold"
                    style={monoFont}
                  >
                    {pricing.price}
                  </span>
                  <span 
                    className="text-xl text-landing-muted"
                    style={sansFont}
                  >
                    {pricing.period}
                  </span>
                </div>

                <p 
                  className="mb-8 text-landing-muted"
                  style={sansFont}
                >
                  {pricing.description}
                </p>

                <Link
                  href={pricing.cta.href}
                  className="inline-flex items-center justify-center w-full rounded-lg px-8 py-4 bg-landing-accent text-landing-bg font-bold text-sm tracking-wider uppercase hover:bg-landing-accent/90 transition-all duration-200"
                  style={monoFont}
                >
                  {pricing.cta.text}
                </Link>

                <p 
                  className="mt-4 text-center text-xs text-landing-border-muted"
                  style={sansFont}
                >
                  {pricing.note}
                </p>
              </div>

              <div className="p-10 lg:p-12">
                <h3 
                  className="text-sm uppercase tracking-wider text-landing-muted mb-6"
                  style={monoFont}
                >
                  What you get
                </h3>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {pricing.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-landing-accent mt-0.5">*</span>
                      <span 
                        className="text-sm text-landing-muted"
                        style={sansFont}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 lg:py-32 border-b border-landing-border">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-16"
            style={monoFont}
          >
            {faq.sectionTitle}
          </h2>

          <div className="space-y-0">
            {faq.items.map((item, index) => (
              <div 
                key={index} 
                className="border-b border-landing-border py-6"
              >
                <details className="group">
                  <summary className="flex justify-between items-start cursor-pointer list-none">
                    <span 
                      className="text-lg font-medium pr-8 hover:text-landing-accent transition-colors"
                      style={monoFont}
                    >
                      {item.question}
                    </span>
                    <span 
                      className="text-2xl text-landing-accent transition-transform group-open:rotate-45"
                      style={monoFont}
                    >
                      +
                    </span>
                  </summary>
                  <p 
                    className="mt-4 leading-relaxed text-landing-muted"
                    style={sansFont}
                  >
                    {item.answer}
                  </p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={monoFont}
          >
            {cta.headline}
          </h2>
          <p 
            className="mb-10 text-lg max-w-xl mx-auto text-landing-muted"
            style={sansFont}
          >
            {cta.subheadline}
          </p>
          <Link
            href={cta.button.href}
            className="inline-flex items-center rounded-lg gap-3 px-10 py-5 bg-landing-accent text-landing-bg font-bold text-sm tracking-wider uppercase hover:bg-landing-accent/90 transition-all duration-200"
            style={monoFont}
          >
            {cta.button.text}
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-landing-border py-8">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-landing-accent">{brand.logo}</span>
              <span 
                className="text-sm font-bold"
                style={monoFont}
              >
                {brand.name}
              </span>
            </div>
            <div className="flex items-center gap-8">
              {footer.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-xs text-landing-muted hover:text-landing-fg transition-colors"
                  style={sansFont}
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
          <p 
            className="mt-6 text-center text-xs text-landing-border-muted"
            style={sansFont}
          >
            {footer.copyright}
          </p>
        </div>
      </footer>
    </main>
  );
}
