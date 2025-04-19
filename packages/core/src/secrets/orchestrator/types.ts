
import type { KubricateConfig, BaseLogger } from '../../types.js';

export interface SecretsOrchestratorOptions {
  config: KubricateConfig;
  effectOptions: EffectsOptions;
  logger: BaseLogger;
}

export interface EffectsOptions {
  workingDir?: string;
}

/**
 * Strategy to resolve merge conflicts between secret values at different levels.
 *
 * - 'overwrite'  — Latest value overrides the previous one.
 * - 'error'      — Throw an error if a conflict is detected.
 * - 'autoMerge'  — Merge object values (shallow), otherwise use last value.
 */
export type MergeStrategy =
  | 'overwrite'
  | 'error'
  | 'autoMerge';

/**
 * Supported levels where merge conflicts can occur.
 * Derived from keys of `ConfigMergeOptions['merge']`.
 */
export type MergeLevel = keyof NonNullable<ConfigMergeOptions['merge']>;


export interface ConfigMergeOptions {
  /**
   * Merge Configuration object for controlling secret merge behavior at each level.
   *
   * All levels are optional. If unspecified, the orchestrator will apply the default strategy:
   * - intraProvider: 'autoMerge'
   * - crossProvider: 'error'
   * - intraStack: 'error'
   */
  merge?: {
    /**
     * Merge strategy for secrets managed by the same provider instance.
     * Safe to auto-merge by default.
     * 
     * @default 'autoMerge'
     */
    intraProvider?: MergeStrategy;

    /**
     * Merge strategy across multiple providers in the same SecretManager.
     * 
     * @default 'error'
     */
    crossProvider?: MergeStrategy;

    /**
     * Merge strategy across SecretManagers within the same stack.
     * 
     * @default 'error'
     */
    intraStack?: MergeStrategy;
  };
}
