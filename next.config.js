/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  i18n: {
    locales: ["en", "tr"], // Desteklenen diller
    defaultLocale: "en", // Varsayılan dil
    localeDetection: false, // Dil algılamasını devre dışı bırak
  },
  images: {
    domains: [
      "cdn.ikost.com",
      "cdn03.ciceksepeti.com",
      "www.cicekdiyari.com",
      "cdn.dsmcdn.com",
      "www.arelia.com.tr",
      "www.italianflora.com",
      "www.cicekevi.com.tr",
      "www.ascicekevi.com",
      "static.ticimax.cloud",
      "www.cicekpostasi.com",
      "encrypted-tbn0.gstatic.com",
    ],
  },
};
