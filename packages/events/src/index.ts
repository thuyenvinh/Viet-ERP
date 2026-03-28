// ============================================================
// @erp/events - Main Entry Point
// RRI-T Upgraded: DLQ + Versioning + Idempotency
// ============================================================

export { publish, publishBatch } from './publisher';
export { subscribe } from './subscriber';
export type { EventHandler } from './subscriber';
export {
  getConnection,
  getJetStream,
  ensureStreams,
  closeConnection,
} from './connection';

// ─── DLQ (Dead Letter Queue) ────────────────────────────────
export {
  DeadLetterQueue,
  getDLQ,
  calculateRetryDelay,
  shouldRetry,
  RETRY_POLICIES,
} from './dlq';
export type { DLQEntry, DLQStats, RetryPolicy } from './dlq';

// ─── Event Versioning + Idempotency ────────────────────────
export {
  getSchemaRegistry,
  IdempotencyStore,
  getIdempotencyStore,
  createVersionedEnvelope,
  processIncomingEvent,
  generateCorrelationId,
  generateCausationId,
} from './versioning';
export type { EventSchema, VersionedEnvelope, IdempotencyRecord } from './versioning';
