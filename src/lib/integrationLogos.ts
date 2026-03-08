// Shared logo mapping for integration IDs to real brand logos
export const INTEGRATION_LOGOS: Record<string, string> = {
  slack: "https://cdn.simpleicons.org/slack",
  whatsapp: "https://cdn.simpleicons.org/whatsapp",
  gmail: "https://cdn.simpleicons.org/gmail",
  outlook: "https://cdn.simpleicons.org/microsoftoutlook",
  drive: "https://cdn.simpleicons.org/googledrive",
  s3: "https://cdn.simpleicons.org/amazons3",
  notion: "https://cdn.simpleicons.org/notion/000000",
  github: "https://cdn.simpleicons.org/github/000000",
  jira: "https://cdn.simpleicons.org/jira",
  hubspot: "https://cdn.simpleicons.org/hubspot",
  salesforce: "https://cdn.simpleicons.org/salesforce",
  twilio: "https://cdn.simpleicons.org/twilio",
  stripe: "https://cdn.simpleicons.org/stripe",
  zapier: "https://cdn.simpleicons.org/zapier",
  amplitude: "https://cdn.simpleicons.org/amplitude",
  postgres: "https://cdn.simpleicons.org/postgresql",
  mongodb: "https://cdn.simpleicons.org/mongodb",
  openai: "https://cdn.simpleicons.org/openai/000000",
  anthropic: "https://cdn.simpleicons.org/anthropic/000000",
  telegram: "https://cdn.simpleicons.org/telegram",
  linkedin: "https://cdn.simpleicons.org/linkedin",
  x: "https://cdn.simpleicons.org/x/000000",
};

export const getIntegrationLogo = (id: string): string =>
  INTEGRATION_LOGOS[id] || `https://cdn.simpleicons.org/${id}`;
