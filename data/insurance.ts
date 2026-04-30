export type InsurancePlan = {
  type: string
  name: string
  carrier: string
  portalUrl: string
  active: boolean
}

export const INSURANCE_PLACEHOLDERS: InsurancePlan[] = [
  {
    type: 'Life Insurance',
    name: '20-Year Term Life',
    carrier: 'Canada Life',
    portalUrl: '',        // add when available
    active: true,
  },
  {
    type: 'Living Benefits',
    name: 'Critical Illness',
    carrier: 'Manulife',
    portalUrl: '',        // add when available
    active: true,
  },
  {
    type: 'Income Protection',
    name: 'Disability Insurance',
    carrier: 'iA Financial',
    portalUrl: '',        // add when available
    active: true,
  },
]
