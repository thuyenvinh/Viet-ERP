// ============================================================
// @erp/ai-copilot — Type Definitions
// ============================================================

export type CopilotModule = 'hrm' | 'crm' | 'mrp' | 'accounting' | 'otb' | 'pm' | 'tpm' | 'excel-ai' | 'general';

export interface CopilotConfig {
  apiKey: string;
  model?: string;              // default: claude-sonnet-4-20250514
  maxTokens?: number;          // default: 4096
  temperature?: number;        // default: 0.3 for structured, 0.7 for creative
  language?: 'vi' | 'en';     // default: 'vi'
  enabledModules?: CopilotModule[];
}

export interface ConversationContext {
  conversationId: string;
  userId: string;
  tenantId: string;
  tier: 'basic' | 'pro' | 'enterprise';
  module: CopilotModule;
  language: 'vi' | 'en';
  history: ChatMessage[];
  metadata: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  metadata?: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  name: string;
  content: string;
  isError?: boolean;
}

export interface CopilotTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>, context: ConversationContext) => Promise<string>;
}

export interface CopilotResponse {
  message: ChatMessage;
  suggestedActions?: SuggestedAction[];
  dataCards?: DataCard[];
  confidence?: number;
}

export interface SuggestedAction {
  label: string;
  labelVi: string;
  action: string;      // 'navigate', 'execute', 'query', 'create'
  payload: Record<string, unknown>;
  icon?: string;
}

export interface DataCard {
  title: string;
  type: 'metric' | 'table' | 'chart' | 'list' | 'alert';
  data: unknown;
  source: string;      // Module that provided the data
}

export interface ModuleAssistant {
  module: CopilotModule;
  systemPrompt: string;
  tools: CopilotTool[];
  contextBuilder: (context: ConversationContext) => Promise<string>;
  intentClassifier?: (message: string) => Promise<string>;
}

export interface StreamChunk {
  type: 'text' | 'tool_use' | 'tool_result' | 'done' | 'error';
  content?: string;
  toolCall?: ToolCall;
  toolResult?: ToolResult;
  error?: string;
}
