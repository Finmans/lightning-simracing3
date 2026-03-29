import { MetadataRoute } from "next";
import { readProducts } from "@/lib/db";

const BASE_URL = "https://lightning-simracing.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await readProducts();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/rent`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => p.status === "active")
    .map((product) => ({
      url: `${BASE_URL}/product/${product.id}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: product.featured ? 0.8 : 0.7,
    }));

  return [...staticRoutes, ...productRoutes];
}
