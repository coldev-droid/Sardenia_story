import { pgTable, text, serial, timestamp, jsonb, boolean, integer, doublePrecision } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const checkpoints = pgTable('checkpoints', {
  id: serial('id').primaryKey(),
  checkpointId: text('checkpoint_id').notNull().unique(),
  sequence: integer('sequence').notNull(),
  parentCheckpointId: text('parent_checkpoint_id'),
  bookId: text('book_id').notNull(),
  chapterId: text('chapter_id').notNull(),
  sceneId: text('scene_id').notNull(),
  wordCount: integer('word_count').notNull(),
  stateJson: text('state_json').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  factualAuditJson: jsonb('factual_audit_json'),
  continuityAuditJson: jsonb('continuity_audit_json'),
  generationMetadataJson: jsonb('generation_metadata_json')
});

export const jobsQueue = pgTable('jobs_queue', {
  id: serial('id').primaryKey(),
  jobId: text('job_id').notNull().unique(),
  sequence: serial('sequence').notNull(),
  parentCheckpointId: text('parent_checkpoint_id').notNull(),
  pipelineAction: text('pipeline_action').notNull(),
  status: text('status').notNull(), // QUEUED, PROCESSING, COMPLETED, FAILED
  createdAt: timestamp('created_at').defaultNow(),
  scheduledFor: timestamp('scheduled_for').notNull(),
  claimedAt: timestamp('claimed_at'),
  workerId: text('worker_id'),
  fencingToken: integer('fencing_token'),
  modelName: text('model_name'),
  promptVersion: text('prompt_version')
});

export const inspectorReports = pgTable('inspector_reports', {
  id: serial('id').primaryKey(),
  checkpointId: text('checkpoint_id').notNull(),
  inspectorId: text('inspector_id').notNull(),
  pass: boolean('pass').notNull(),
  score: doublePrecision('score').notNull(),
  evidence: text('evidence').notNull(),
  sourceUrls: jsonb('source_urls'), // array of urls
  createdAt: timestamp('created_at').defaultNow()
});

export const watchdogAuditLog = pgTable('watchdog_audit_log', {
  id: serial('id').primaryKey(),
  eventId: text('event_id').notNull().unique(),
  timestamp: timestamp('timestamp').notNull(),
  fromState: text('from_state').notNull(),
  toState: text('to_state').notNull(),
  action: text('action').notNull(),
  stopReason: text('stop_reason'),
  checkpointHash: text('checkpoint_hash'),
  detail: text('detail').notNull(),
  score: doublePrecision('score'),
  workerId: text('worker_id').notNull(),
  integrityHash: text('integrity_hash')
});
