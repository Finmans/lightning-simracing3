import { OrganizationJsonLd, WebsiteJsonLd, LocalBusinessJsonLd } from "./StructuredData";

const BASE_URL = "https://lightning-simracing.vercel.app";
const SITE_NAME = "Lightning SimRacing";

export default function SEO() {
  return (
    <>
      <OrganizationJsonLd baseUrl={BASE_URL} siteName={SITE_NAME} />
      <WebsiteJsonLd baseUrl={BASE_URL} siteName={SITE_NAME} />
      <LocalBusinessJsonLd baseUrl={BASE_URL} siteName={SITE_NAME} />
    </>
  );
}
