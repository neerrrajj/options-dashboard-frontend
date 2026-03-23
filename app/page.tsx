'use client';

import Image from "next/image";
import Link from "next/link";
import { landingConfig } from "./landing-config";
import { GetStartedButton } from "@/components/get-started-button";

const monoFont = { fontFamily: 'var(--font-mono), monospace' };

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
                >
                  {link.text}
                </Link>
              ))}
            </div>

            <GetStartedButton className="px-6 py-2.5 rounded-lg bg-landing-accent text-landing-bg text-sm font-semibold hover:bg-landing-accent/90 transition-colors tracking-wide">
              {nav.cta.text}
            </GetStartedButton>
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
            <div className="space-y-8 max-w-xl h-full">
              <div className="inline-flex items-center rounded-full gap-2 px-3 py-1.5 border border-landing-border-muted bg-landing-border-muted/50">
                <div className="w-1.5 h-1.5 bg-landing-accent rounded-full animate-pulse" />
                <div 
                  className="text-xs font-medium uppercase tracking-wider text-landing-muted"
                >
                  {hero.badge}
                </div>
              </div>

              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1]"
              >
                {hero.headline}
              </h1>

              <p 
                className="text-lg leading-relaxed text-landing-muted"
              >
                {hero.subheadline}
              </p>

              <GetStartedButton className="inline-flex items-center rounded-lg gap-3 mt-12 px-8 py-4 bg-landing-accent text-landing-bg font-semibold text-base hover:bg-landing-accent/90 transition-all duration-200">
                {hero.cta.text}
                <span>→</span>
              </GetStartedButton>
            </div>

            <div className="relative h-[450px] lg:h-[500px] w-full hidden lg:block">
              {/* Stacked Cards Layout */}
              
              {/* GEX Analysis Card - Top Right */}
              <div className="absolute top-0 left-10 w-[420px] h-[200px] rounded-xl border-white/30 overflow-hidden shadow-lg opacity-90 hover:opacity-100 transition-opacity">
                {/* <span className="relative top-12 left-12 text-white/90 text-xl font-medium z-10">GEX analysis</span> */}
                <Image src={features.items[0].image} alt="GEX Chart" fill className="object-cover" />
              </div>

              {/* Net GEX Card - Center Left */}
              <div className="absolute top-[90px] bottom-0 right-[20px] w-[420px] h-[220px] object-contain rounded-xl border-white/30 overflow-hidden shadow-lg opacity-90 hover:opacity-100 transition-opacity">
                <Image src={features.items[1].image} alt="Net GEX Chart" fill className="object-cover" />
              </div>

              {/* Greeks Analysis Card - Bottom Right */}
              <div className="absolute bottom-0 left-24 w-[420px] h-[200px] rounded-xl border-white/30 overflow-hidden shadow-lg opacity-90 hover:opacity-100 transition-opacity">
                {/* <span className="absolute bottom-3 right-3 text-white/90 text-sm font-medium z-10">greeks analysis</span> */}
                <Image src={features.items[2].image} alt="OTM Greeks Chart" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 lg:py-32 border-b border-landing-border">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 
            className="text-3xl md:text-5xl font-bold mb-32 text-center underline underline-offset-8"
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
                  >
                    {feature.title}
                  </h3>
                  
                  <p 
                    className="text-lg leading-relaxed text-landing-muted"
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
            className="text-3xl md:text-5xl font-bold mb-16 text-center underline underline-offset-8"
          >
            {pricing.sectionTitle}
          </h2>

          <div className="border border-landing-border-light bg-[#0d0d0d]">
            <div className="grid lg:grid-cols-12">
              <div className="p-10 lg:p-12 col-span-5 border-b lg:border-b-0 lg:border-r border-landing-border-light">
                <div 
                  className="inline-block px-3 py-1 mb-6 text-xs uppercase tracking-wider text-landing-muted border border-landing-border-muted"
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
                  >
                    {pricing.period}
                  </span>
                </div>

                <p 
                  className="mb-8 text-landing-muted"
                >
                  {pricing.description}
                </p>

                <GetStartedButton className="inline-flex items-center justify-center w-full rounded-lg px-8 py-4 bg-landing-accent text-landing-bg font-bold text-sm tracking-wider uppercase hover:bg-landing-accent/90 transition-all duration-200">
                  {pricing.cta.text}
                </GetStartedButton>

                <p 
                  className="mt-4 text-center text-xs text-landing-border-muted"
                >
                  {pricing.note}
                </p>
              </div>

              <div className="p-10 lg:p-12 col-span-7">
                <ul className="grid sm:grid-cols-2 gap-4">
                  {pricing.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-landing-accent mt-0.5">*</span>
                      <span 
                        className=" text-landing-muted"
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
            className="text-3xl md:text-5xl font-bold mb-16 text-center underline underline-offset-8"
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
                    >
                      {item.question}
                    </span>
                    <span 
                      className="text-2xl text-landing-accent transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p 
                    className="mt-4 leading-relaxed text-landing-muted"
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
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            {cta.headline}
          </h2>
          <p 
            className="mb-10 text-lg max-w-xl mx-auto text-landing-muted"
          >
            {cta.subheadline}
          </p>
          <GetStartedButton className="inline-flex items-center rounded-lg gap-3 px-10 py-4 bg-landing-accent text-landing-bg font-semibold hover:bg-landing-accent/90 transition-all duration-200">
            {cta.button.text}
            <span className="text-lg">→</span>
          </GetStartedButton>
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
                  className="text-sm text-landing-muted hover:text-landing-fg transition-colors"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
