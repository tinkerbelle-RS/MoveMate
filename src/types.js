/** @typedef {'low' | 'medium' | 'high'} RiskLevel */

/**
 * @typedef {Object} UncertainField
 * @property {string} field
 * @property {string} reason
 */

/**
 * @typedef {Object} LeaseAnalysis
 * @property {number|string|null} [rent_amount]
 * @property {number|string|null} [security_deposit]
 * @property {string|null} [lease_start_date]
 * @property {string|null} [lease_end_date]
 * @property {string|null} [rent_due_day]
 * @property {string|null} [late_fee_policy]
 * @property {string|null} [utilities]
 * @property {string|null} [termination_notice_period]
 * @property {string|null} [early_termination_penalties]
 * @property {string|null} [subletting_policy]
 * @property {string|null} [guest_policy]
 * @property {string|null} [noise_policy]
 * @property {string|null} [pets_policy]
 * @property {string|null} [inspection_policy]
 * @property {string[]} [unusual_or_high_risk_clauses]
 * @property {RiskLevel} [overall_risk_level]
 * @property {string} [risk_summary]
 * @property {string[]} [move_in_tasks]
 * @property {string[]} [during_lease_tasks]
 * @property {string[]} [move_out_tasks]
 * @property {UncertainField[]} [uncertain_fields]
 * @property {string[]} [payments_and_fees]
 * @property {string[]} [rules_and_restrictions]
 * @property {string[]} [termination_and_renewal]
 */

/**
 * @typedef {Object} ChecklistItem
 * @property {string} id
 * @property {string} text
 * @property {boolean} done
 * @property {string} notes
 */

/**
 * @typedef {Object} StoredLease
 * @property {string} id
 * @property {string} fileName
 * @property {number} analyzedAt
 * @property {LeaseAnalysis} analysis
 * @property {Record<string, ChecklistItem[]>} checklists
 */

export {};
