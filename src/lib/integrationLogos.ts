// Shared logo mapping for integration IDs to real brand logos
// Using jsdelivr CDN for simple-icons SVGs (reliable and fast)
const SI = "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons";

export const INTEGRATION_LOGOS: Record<string, string> = {
  slack: `${SI}/slack.svg`,
  whatsapp: `${SI}/whatsapp.svg`,
  gmail: `${SI}/gmail.svg`,
  outlook: `${SI}/microsoftoutlook.svg`,
  drive: `${SI}/googledrive.svg`,
  s3: `${SI}/amazons3.svg`,
  notion: `${SI}/notion.svg`,
  github: `${SI}/github.svg`,
  jira: `${SI}/jira.svg`,
  hubspot: `${SI}/hubspot.svg`,
  salesforce: `${SI}/salesforce.svg`,
  twilio: `${SI}/twilio.svg`,
  stripe: `${SI}/stripe.svg`,
  zapier: `${SI}/zapier.svg`,
  amplitude: `${SI}/amplitude.svg`,
  postgres: `${SI}/postgresql.svg`,
  mongodb: `${SI}/mongodb.svg`,
  openai: `${SI}/openai.svg`,
  anthropic: `${SI}/anthropic.svg`,
  telegram: `${SI}/telegram.svg`,
  linkedin: `${SI}/linkedin.svg`,
  x: `${SI}/x.svg`,
};

export const getIntegrationLogo = (id: string): string =>
  INTEGRATION_LOGOS[id] || `${SI}/${id}.svg`;
