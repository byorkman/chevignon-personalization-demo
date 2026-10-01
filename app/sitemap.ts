import type { MetadataRoute } from "next";
import { products } from "@/data/products";

// ESTA LÍNEA ES LA CLAVE: Evita que Vercel guarde el sitemap viejo
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function sitemap(): MetadataRoute.Sitemap {
  // Hardcodeamos la URL final para no depender de variables
  const BASE_URL = "https://chevignon-personalization-demo.vercel.app";
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/productos`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/nuestra-historia`, lastModified: now, changeFrequency: "monthly", priority: 0.6 }
  ];

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/producto/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  return [...staticEntries, ...productEntries];
}
