// ============================================================
// @erp/sdk — ERP Developer SDK (Enterprise Tier)
//
// Usage:
//   import { ERPClient } from '@erp/sdk';
//   const client = new ERPClient({ baseUrl: 'https://erp.example.com/api', apiKey: '...' });
//   const customers = await client.customers.list({ page: 1, pageSize: 20 });
//
//   import { WebhookManager } from '@erp/sdk/webhooks';
//   import { PluginManager } from '@erp/sdk/plugins';
// ============================================================

export { ERPClient, ResourceClient, ModuleClient, ERPClientError } from './client';
export type { ERPClientConfig } from './client';

export { WebhookManager } from './webhooks';
export type { WebhookConfig, WebhookPayload, WebhookDelivery, RetryPolicy } from './webhooks';

export { PluginManager } from './plugins';
export type { ERPPlugin, PluginHook, PluginRoute, PluginSetting, PluginContext } from './plugins';
