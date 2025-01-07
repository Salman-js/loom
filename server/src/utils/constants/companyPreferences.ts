export const DEFAULT_COMPANY_PREFERENCES = {
  purchaseOrderRequiresApproval: true,
  salesOrderRequiresApproval: false,
  defaultCurrency: 'USD',
  taxLineType: 'Transaction',
  discountLineType: 'Line',
  inventoryTrackingMethod: 'FIFO',
  allowNegativeInventory: false,
} as const;

export type CompanyPreferenceKey = keyof typeof DEFAULT_COMPANY_PREFERENCES;

//   defaultPaymentTerm: 'net30',
// ... add more preferences as needed
