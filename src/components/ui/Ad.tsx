import { Box } from "@chakra-ui/react";
import React from "react";

type AdVariant =
  | "leaderboard"
  | "rectangle"
  | "verticalSkyscraper"
  | "bannerWide"
  | "bannerTall"
  | "mobileRectangle"
  | "mobileWide"
  | "mobileWider";

const AD_PROPS: Record<
  AdVariant,
  { idZone: string; width: string; height: string }
> = {
  leaderboard: { idZone: "5521398", width: "728", height: "90" },
  rectangle: { idZone: "5521416", width: "300", height: "250" },
  verticalSkyscraper: { idZone: "5521418", width: "160", height: "600" },
  bannerWide: { idZone: "5521420", width: "900", height: "250" },
  bannerTall: { idZone: "5521422", width: "300", height: "500" },
  mobileRectangle: { idZone: "5521430", width: "300", height: "250" },
  mobileWide: { idZone: "5521432", width: "300", height: "100" },
  mobileWider: { idZone: "5521434", width: "300", height: "50" },
};

const TAGS = [
  "humor",
  "funny",
  "streaming",
  "games",
  "gaming",
  "ea fc",
  "ea sports",
  "eafc 25",
  "sbc",
  "squad building challenge",
  "fifa",
  "ultimate team",
  "fut",
  "futbin",
  "futwiz",
  "football",
  "soccer",
  "sports",
  "fitness",
];

export default function Ad({ variant }: { variant: AdVariant }) {
  const { idZone, width, height } = AD_PROPS[variant];

  return (
    <Box
      position="relative"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <iframe
        src={`//a.magsrv.com/iframe.php?idzone=${idZone}&size=${width}x${height}&tags=${TAGS.join(
          ","
        )}`}
        style={{ outline: "1px solid red" }}
        width={width}
        height={height}
        scrolling="no"
        marginWidth={0}
        marginHeight={0}
        frameBorder={0}
      ></iframe>
    </Box>
  );
}
