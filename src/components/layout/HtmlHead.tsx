import Head from "next/head";

interface HtmlHeadProps {
  title: string;
  description: string;
}

export default function HtmlHead({ title, description }: HtmlHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="manifest" href="manifest.json" />

      <meta
        name="google-site-verification"
        content={process.env.NEXT_PUBLIC_SITE_VERIFICATION}
      />
      {/* AdSense */}
      <meta name="google-adsense-account" content="ca-pub-3653518580503209" />
      {/* ExoClick */}
      <meta
        name="6a97888e-site-verification"
        content="7696dd57872b300305398f45c5d82f4d"
      />
      {/* AdMaven */}
      <meta name="admaven-placement" content="Bqdk6rjCF" />

      {/* OG tags */}
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content="Calculate the cheapest player rating combinations for EA Sports FC (FIFA) 24 Ultimate Team SBCs based on FUTBIN and FUTWIZ price data"
      />
      <meta property="og:site_name" content="SBC Cruncher" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://sbccruncher.cc" />
      {/* 200x200px - 1200x1200px */}
      <meta property="og:image" content="https://i.imgur.com/pHxDN7k.png" />

      <meta name="google" content="notranslate"></meta>
    </Head>
  );
}
