interface OrganizationJsonLdProps {
  baseUrl: string;
  siteName: string;
}

export function OrganizationJsonLd({ baseUrl, siteName }: OrganizationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    sameAs: [
      "https://page.line.me/lightningsimracing",
      "https://www.facebook.com/lightningsimracing",
      "https://instagram.com/lightningsimracing",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+66-99-999-9999",
      contactType: "customer service",
      areaServed: "TH",
      availableLanguage: ["Thai", "English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangkok",
      addressRegion: "Thailand",
      addressCountry: "TH",
    },
    priceRange: "฿฿",
    image: `${baseUrl}/favicon.ico`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebsiteJsonLdProps {
  baseUrl: string;
  siteName: string;
}

export function WebsiteJsonLd({ baseUrl, siteName }: WebsiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: baseUrl,
    description: "ร้านค้าอุปกรณ์ Sim Racing มือสอง สภาพดี ราคาคุ้มค่า",
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/favicon.ico`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  baseUrl: string;
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbJsonLd({ baseUrl, items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ProductJsonLdProps {
  product: {
    id: string;
    title: string;
    description: string;
    brand: string;
    category: string;
    condition: string;
    salePrice: number | null;
    originalPrice: number | null;
    images: string[];
    status: string;
    features: string[];
  };
  baseUrl: string;
}

export function ProductJsonLd({ product, baseUrl }: ProductJsonLdProps) {
  const conditionMap: Record<string, string> = {
    new: "https://schema.org/NewCondition",
    "like-new": "https://schema.org/NewCondition",
    good: "https://schema.org/UsedCondition",
    fair: "https://schema.org/UsedCondition",
    poor: "https://schema.org/UsedCondition",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category,
    condition: conditionMap[product.condition] || "https://schema.org/UsedCondition",
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/product/${product.id}`,
      priceCurrency: "THB",
      price: product.salePrice || "0",
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: product.status === "active"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Lightning SimRacing",
      },
    },
    aggregateRating:
      product.status === "active"
        ? {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "50",
          }
        : undefined,
  };

  // Filter out undefined values
  const cleanJsonLd = JSON.parse(JSON.stringify(jsonLd));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanJsonLd) }}
    />
  );
}

interface LocalBusinessJsonLdProps {
  baseUrl: string;
  siteName: string;
}

export function LocalBusinessJsonLd({ baseUrl, siteName }: LocalBusinessJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": baseUrl,
    name: siteName,
    image: `${baseUrl}/favicon.ico`,
    url: baseUrl,
    telephone: "+66-99-999-9999",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangkok",
      addressRegion: "Bangkok",
      addressCountry: "TH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "13.7563",
      longitude: "100.5018",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "21:00",
    },
    priceRange: "฿฿",
    sameAs: [
      "https://page.line.me/lightningsimracing",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
