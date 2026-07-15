export const siteConfig = {
  name: "Language101 Study Toolkit",
  description: "Choose an activity and start talking. Free materials for Language101 meetups.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://language101-study-toolkit.vercel.app",
  reservationUrl: process.env.NEXT_PUBLIC_RESERVATION_URL || "",
  naverCafeUrl: process.env.NEXT_PUBLIC_NAVER_CAFE_URL || "https://cafe.naver.com/language101",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/101language",
  contactUrl: process.env.NEXT_PUBLIC_CONTACT_URL || "https://cafe.naver.com/language101",
  brandColor: process.env.NEXT_PUBLIC_BRAND_COLOR || "#6C4CF1",
} as const;
