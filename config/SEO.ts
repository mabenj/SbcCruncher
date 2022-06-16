import Config from "./Config";

const SEO = {
    siteName: "SBC Cruncher",
    title: "SBC Cruncher - FIFA Ultimate Team SBC Rating Calculator",
    description:
        "SBC Cruncher calculates the cheapest player rating combinations for FIFA Ultimate Team SBCs based on FUTBIN price data",
    url: "https://sbccruncher.cc",
    bannerImage: "https://i.imgur.com/pHxDN7k.png",
    siteVerificationGoogle: "k5Shx6P2PcuHEhWQ_DYgw6k1L562FAY-V0N1dAPuc1Y",
    trackingCodeGA:
        Config.environment === "prod" ? process.env.GA_TRACKING_CODE || "" : ""
};
export default SEO;
