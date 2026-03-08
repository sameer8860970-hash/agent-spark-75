import { createContext, useContext, useState, ReactNode } from "react";

export interface Integration {
  id: string;
  name: string;
  icon: string;
  logo: string;
  color: string;
  connected: boolean;
  category: string;
  description: string;
}

export interface WorkflowStep {
  id: string;
  type: "trigger" | "action" | "condition" | "llm";
  label: string;
  tool?: string;
  config: Record<string, string>;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "draft" | "error";
  trigger: string;
  schedule?: string;
  steps: WorkflowStep[];
  integrations: string[];
  createdAt: Date;
  lastRun?: Date;
  runs: number;
  successRate: number;
}

export interface Job {
  id: string;
  agentId: string;
  name: string;
  initiatedBy: string;
  status: "Done" | "Pending" | "Failed" | "In process" | "Queued";
  startedAt: string;
  finishedAt: string;
  schedule: string;
}

const INTEGRATIONS: Integration[] = [
  { id: "slack", name: "Slack", icon: "💬", logo: "https://cdn.simpleicons.org/slack", color: "#4A154B", connected: false, category: "Messaging", description: "Send and receive messages in Slack channels" },
  { id: "whatsapp", name: "WhatsApp", icon: "📱", logo: "https://cdn.simpleicons.org/whatsapp", color: "#25D366", connected: false, category: "Messaging", description: "WhatsApp Business API for messaging and files" },
  { id: "gmail", name: "Gmail", icon: "✉️", logo: "https://cdn.simpleicons.org/gmail", color: "#EA4335", connected: false, category: "Email", description: "Send and receive emails via Gmail" },
  { id: "outlook", name: "Outlook", icon: "📧", logo: "https://cdn.simpleicons.org/microsoftoutlook", color: "#0078D4", connected: false, category: "Email", description: "Microsoft Outlook email integration" },
  { id: "drive", name: "Google Drive", icon: "📁", logo: "https://cdn.simpleicons.org/googledrive", color: "#4285F4", connected: false, category: "Storage", description: "Access and manage Google Drive files" },
  { id: "s3", name: "AWS S3", icon: "🪣", logo: "https://cdn.simpleicons.org/amazons3", color: "#569A31", connected: false, category: "Storage", description: "Amazon S3 cloud storage" },
  { id: "notion", name: "Notion", icon: "📝", logo: "https://cdn.simpleicons.org/notion/000000", color: "#000000", connected: false, category: "Productivity", description: "Read and write Notion pages and databases" },
  { id: "github", name: "GitHub", icon: "🐙", logo: "https://cdn.simpleicons.org/github/000000", color: "#181717", connected: false, category: "Development", description: "Manage repos, issues, and pull requests" },
  { id: "jira", name: "Jira", icon: "🔷", logo: "https://cdn.simpleicons.org/jira", color: "#0052CC", connected: false, category: "Project Management", description: "Track and manage Jira issues" },
  { id: "hubspot", name: "HubSpot", icon: "🟠", logo: "https://cdn.simpleicons.org/hubspot", color: "#FF7A59", connected: false, category: "CRM", description: "CRM contacts, deals, and workflows" },
  { id: "salesforce", name: "Salesforce", icon: "☁️", logo: "https://cdn.simpleicons.org/salesforce", color: "#00A1E0", connected: false, category: "CRM", description: "Salesforce CRM integration" },
  { id: "twilio", name: "Twilio", icon: "📞", logo: "https://cdn.simpleicons.org/twilio", color: "#F22F46", connected: false, category: "Communication", description: "SMS, voice, and video communications" },
  { id: "stripe", name: "Stripe", icon: "💳", logo: "https://cdn.simpleicons.org/stripe", color: "#635BFF", connected: false, category: "Payments", description: "Payment processing and billing" },
  { id: "zapier", name: "Zapier", icon: "⚡", logo: "https://cdn.simpleicons.org/zapier", color: "#FF4A00", connected: false, category: "Automation", description: "Connect to 5000+ apps via Zapier" },
  { id: "amplitude", name: "Amplitude", icon: "📊", logo: "https://cdn.simpleicons.org/amplitude", color: "#000000", connected: false, category: "Analytics", description: "Product analytics and user insights" },
  { id: "postgres", name: "PostgreSQL", icon: "🐘", logo: "https://cdn.simpleicons.org/postgresql", color: "#4169E1", connected: false, category: "Database", description: "PostgreSQL database queries" },
  { id: "mongodb", name: "MongoDB", icon: "🍃", logo: "https://cdn.simpleicons.org/mongodb", color: "#47A248", connected: false, category: "Database", description: "MongoDB document database" },
  { id: "openai", name: "OpenAI", icon: "🤖", logo: "https://cdn.simpleicons.org/openai/000000", color: "#412991", connected: false, category: "AI Models", description: "GPT models for text generation" },
  { id: "anthropic", name: "Anthropic", icon: "🧠", logo: "https://cdn.simpleicons.org/anthropic/000000", color: "#191919", connected: false, category: "AI Models", description: "Claude models for reasoning" },
  { id: "telegram", name: "Telegram", icon: "✈️", logo: "https://cdn.simpleicons.org/telegram", color: "#26A5E4", connected: false, category: "Messaging", description: "Telegram Bot API integration" },
  { id: "linkedin", name: "LinkedIn", icon: "💼", logo: "https://cdn.simpleicons.org/linkedin", color: "#0A66C2", connected: false, category: "Social", description: "Post updates and manage LinkedIn presence" },
  { id: "x", name: "X (Twitter)", icon: "𝕏", logo: "https://cdn.simpleicons.org/x/000000", color: "#000000", connected: false, category: "Social", description: "Post tweets and monitor mentions" },
];

const SAMPLE_AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "WhatsApp File Processor",
    description: "Fetches files from WhatsApp at 9AM, cleans and organizes data, then sends back",
    status: "active",
    trigger: "schedule",
    schedule: "Daily at 9:00 AM",
    steps: [
      { id: "s1", type: "trigger", label: "Schedule: 9:00 AM Daily", config: { cron: "0 9 * * *" } },
      { id: "s2", type: "action", label: "Fetch file from WhatsApp", tool: "whatsapp", config: { action: "download_file" } },
      { id: "s3", type: "llm", label: "Clean & organize data", config: { prompt: "Clean and organize the attached file data" } },
      { id: "s4", type: "action", label: "Send processed file", tool: "whatsapp", config: { action: "send_file" } },
    ],
    integrations: ["whatsapp"],
    createdAt: new Date("2024-11-20"),
    lastRun: new Date("2024-11-29T15:30:00"),
    runs: 45,
    successRate: 96,
  },
  {
    id: "agent-2",
    name: "Lead Qualification Bot",
    description: "Qualifies incoming leads from HubSpot using AI analysis and routes to sales team",
    status: "active",
    trigger: "event",
    steps: [
      { id: "s1", type: "trigger", label: "New HubSpot contact", config: { event: "hubspot.contact.created" } },
      { id: "s2", type: "llm", label: "Analyze lead quality", config: { prompt: "Analyze this lead and score 1-10" } },
      { id: "s3", type: "condition", label: "Score > 7?", config: { condition: "score > 7" } },
      { id: "s4", type: "action", label: "Notify sales on Slack", tool: "slack", config: { channel: "#sales" } },
    ],
    integrations: ["hubspot", "slack"],
    createdAt: new Date("2024-11-15"),
    lastRun: new Date("2024-11-29T14:00:00"),
    runs: 230,
    successRate: 92,
  },
  {
    id: "agent-3",
    name: "Customer Support Triage",
    description: "Auto-categorizes support tickets from Gmail and creates Jira issues",
    status: "inactive",
    trigger: "event",
    steps: [
      { id: "s1", type: "trigger", label: "New Gmail message", config: { event: "gmail.message.received" } },
      { id: "s2", type: "llm", label: "Categorize ticket", config: { prompt: "Categorize this support email" } },
      { id: "s3", type: "action", label: "Create Jira issue", tool: "jira", config: { project: "SUPPORT" } },
      { id: "s4", type: "action", label: "Send acknowledgment", tool: "gmail", config: { action: "reply" } },
    ],
    integrations: ["gmail", "jira"],
    createdAt: new Date("2024-10-01"),
    lastRun: new Date("2024-11-25T10:00:00"),
    runs: 1200,
    successRate: 88,
  },
  {
    id: "agent-4",
    name: "Weekly Analytics Report",
    description: "Generates weekly analytics summary from Amplitude and posts to Slack",
    status: "active",
    trigger: "schedule",
    schedule: "Every Friday at 6:00 PM",
    steps: [
      { id: "s1", type: "trigger", label: "Schedule: Friday 6PM", config: { cron: "0 18 * * 5" } },
      { id: "s2", type: "action", label: "Pull Amplitude data", tool: "amplitude", config: { query: "weekly_summary" } },
      { id: "s3", type: "llm", label: "Generate report", config: { prompt: "Create a weekly analytics report" } },
      { id: "s4", type: "action", label: "Post to Slack", tool: "slack", config: { channel: "#analytics" } },
    ],
    integrations: ["amplitude", "slack"],
    createdAt: new Date("2024-11-01"),
    lastRun: new Date("2024-11-29T18:00:00"),
    runs: 8,
    successRate: 100,
  },
  {
    id: "agent-5",
    name: "Data Backup Agent",
    description: "Backs up PostgreSQL data to S3 daily",
    status: "draft",
    trigger: "schedule",
    schedule: "Daily at 21:00",
    steps: [
      { id: "s1", type: "trigger", label: "Schedule: 9PM Daily", config: { cron: "0 21 * * *" } },
      { id: "s2", type: "action", label: "Export PostgreSQL", tool: "postgres", config: { action: "dump" } },
      { id: "s3", type: "action", label: "Upload to S3", tool: "s3", config: { bucket: "backups" } },
    ],
    integrations: ["postgres", "s3"],
    createdAt: new Date("2024-11-28"),
    runs: 0,
    successRate: 0,
  },
];

const SAMPLE_JOBS: Job[] = [
  { id: "1", agentId: "agent-1", name: "WhatsApp File Processor", initiatedBy: "Togzhan Agarys", status: "Done", startedAt: "29 Nov 2024, 10:00", finishedAt: "29 Nov 2024, 15:30", schedule: "Daily at 9:00" },
  { id: "2", agentId: "agent-2", name: "Lead Qualification Bot", initiatedBy: "System", status: "Pending", startedAt: "29 Nov 2024, 10:00", finishedAt: "29 Nov 2024, 15:30", schedule: "On event" },
  { id: "3", agentId: "agent-3", name: "Customer Support Triage", initiatedBy: "Jane Smith", status: "Done", startedAt: "29 Nov 2024, 10:00", finishedAt: "29 Nov 2024, 15:30", schedule: "On event" },
  { id: "4", agentId: "agent-4", name: "Weekly Analytics Report", initiatedBy: "System", status: "Pending", startedAt: "29 Nov 2024, 10:00", finishedAt: "29 Nov 2024, 15:30", schedule: "Every Friday at 18:00" },
  { id: "5", agentId: "agent-1", name: "WhatsApp File Processor", initiatedBy: "Admin User", status: "In process", startedAt: "29 Nov 2024, 10:00", finishedAt: "29 Nov 2024, 15:30", schedule: "Daily at 9:00" },
  { id: "6", agentId: "agent-2", name: "Lead Qualification Bot", initiatedBy: "Web researcher", status: "Queued", startedAt: "29 Nov 2024, 10:00", finishedAt: "29 Nov 2024, 15:30", schedule: "On event" },
  { id: "7", agentId: "agent-1", name: "WhatsApp File Processor", initiatedBy: "Togzhan Agarys", status: "Done", startedAt: "29 Nov 2024, 10:00", finishedAt: "29 Nov 2024, 15:30", schedule: "Daily at 9:00" },
  { id: "8", agentId: "agent-3", name: "Customer Support Triage", initiatedBy: "Michael Taylor", status: "In process", startedAt: "29 Nov 2024, 10:00", finishedAt: "29 Nov 2024, 15:30", schedule: "On event" },
  { id: "9", agentId: "agent-2", name: "Lead Qualification Bot", initiatedBy: "Sarah Thompson", status: "In process", startedAt: "29 Nov 2024, 10:00", finishedAt: "29 Nov 2024, 15:30", schedule: "On event" },
  { id: "10", agentId: "agent-3", name: "Customer Support Triage", initiatedBy: "Olivia Martin", status: "Failed", startedAt: "29 Nov 2024, 10:00", finishedAt: "29 Nov 2024, 15:30", schedule: "On event" },
  { id: "11", agentId: "agent-2", name: "Lead Qualification Bot", initiatedBy: "Alex Kim", status: "Failed", startedAt: "29 Nov 2024, 10:00", finishedAt: "29 Nov 2024, 15:30", schedule: "On event" },
  { id: "12", agentId: "agent-4", name: "Weekly Analytics Report", initiatedBy: "Emily Carter", status: "Done", startedAt: "29 Nov 2024, 10:00", finishedAt: "29 Nov 2024, 15:30", schedule: "Every Friday at 18:00" },
  { id: "13", agentId: "agent-1", name: "WhatsApp File Processor", initiatedBy: "Togzhan Agarys", status: "Done", startedAt: "29 Nov 2024, 10:00", finishedAt: "29 Nov 2024, 15:30", schedule: "Daily at 9:00" },
  { id: "14", agentId: "agent-5", name: "Data Backup Agent", initiatedBy: "Togzhan Agarys", status: "Done", startedAt: "29 Nov 2024, 10:00", finishedAt: "29 Nov 2024, 15:30", schedule: "Daily at 21:00" },
];

interface PlatformContextType {
  agents: Agent[];
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
  integrations: Integration[];
  setIntegrations: React.Dispatch<React.SetStateAction<Integration[]>>;
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  toggleIntegration: (id: string) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (agent: Agent) => void;
  deleteAgent: (id: string) => void;
  toggleAgentStatus: (id: string) => void;
}

const PlatformContext = createContext<PlatformContextType | null>(null);

export const usePlatform = () => {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
};

export const PlatformProvider = ({ children }: { children: ReactNode }) => {
  const [agents, setAgents] = useState<Agent[]>(SAMPLE_AGENTS);
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [jobs, setJobs] = useState<Job[]>(SAMPLE_JOBS);

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i))
    );
  };

  const addAgent = (agent: Agent) => {
    setAgents((prev) => [agent, ...prev]);
  };

  const updateAgent = (agent: Agent) => {
    setAgents((prev) => prev.map((a) => (a.id === agent.id ? agent : a)));
  };

  const deleteAgent = (id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleAgentStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? "inactive" : "active" }
          : a
      )
    );
  };

  return (
    <PlatformContext.Provider
      value={{
        agents, setAgents,
        integrations, setIntegrations,
        jobs, setJobs,
        toggleIntegration,
        addAgent, updateAgent, deleteAgent, toggleAgentStatus,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};
