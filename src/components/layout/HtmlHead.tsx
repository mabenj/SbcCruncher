import Head from 'next/head'
import React from 'react'

interface HtmlHeadProps{
    title: string;
    description: string;
}

export default function HtmlHead({title, description}:HtmlHeadProps) {
  return (
    <Head>
        <title>{title}</title>
        <meta
            name="description"
            content={description}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="manifest.json" />

        <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_SITE_VERIFICATION}
        />
        <meta name="google-adsense-account" content="ca-pub-3653518580503209"/>

        {/* <!-- OG tags --> */}
        <meta
            property="og:title"
            content={title}
        />
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
  )
}
