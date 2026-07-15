import type { MetadataRoute } from "next";
import { activities } from "@/data/activities";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://language101-study-toolkit.vercel.app";
  const pages=["activities","missions","expressions","practice-expressions","conversation-help","recommended","random","tools","notes","end-session","qr"];
  return [{ url: base, priority: 1 }, ...pages.map((page)=>({url:`${base}/${page}`,priority:.7})), ...activities.map(({ id }) => ({ url: `${base}/activities/${id}`, priority: 0.8 }))];
}
