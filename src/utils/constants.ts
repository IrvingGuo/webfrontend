// customized global constant
export const ASSIGNMENT_APPROVED = 1;
export const ASSIGNMENT_PENDING = 2;
export const ASSIGNMENT_REJECTED = 4;

export const statusColorMap = new Map([
  [ASSIGNMENT_APPROVED, 'success'],
  [ASSIGNMENT_PENDING, 'processing'],
  [ASSIGNMENT_REJECTED, 'error'],
]);

export const statusNameMap = new Map([
  [ASSIGNMENT_APPROVED, 'approved'],
  [ASSIGNMENT_PENDING, 'pending'],
  [ASSIGNMENT_REJECTED, 'rejected'],
]);

// privilege
export const PRIV_MANAGER = 1;
export const PRIV_RES = 2;
export const PRIV_TPM = 4;

export const privColorMap = new Map([
  [PRIV_MANAGER, 'gold'],
  [PRIV_RES, 'lime'],
  [PRIV_TPM, 'cyan'],
]);

export const privNameMap = new Map([
  [PRIV_MANAGER, 'manager'],
  [PRIV_RES, 'resource planner'],
  [PRIV_TPM, 'tpm'],
]);

// dates
export const defaultEntryDate = '2016-09-07';
export const defaultResignDate = '2099-12-31';
