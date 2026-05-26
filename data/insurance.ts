export type RequirementStatus = 'pending' | 'submitted' | 'received' | 'waived'

export type RequirementItem = {
  id: string
  label: string
  description: string
  status: RequirementStatus
  submittedDate?: string
}

export type UnderwritingStage =
  | 'application_submitted'
  | 'received_by_underwriter'
  | 'initial_requirements'
  | 'followup_requirements'
  | 'policy_approved'
  | 'delivery_receipt'
  | 'in_force'

export type StageInfo = {
  key: UnderwritingStage
  label: string
  shortLabel: string
  description: string
}

export const STAGES: StageInfo[] = [
  {
    key: 'application_submitted',
    label: 'Application Submitted',
    shortLabel: 'Submitted',
    description: 'Your application has been submitted and confirmed by the carrier.',
  },
  {
    key: 'received_by_underwriter',
    label: 'Received by Underwriter',
    shortLabel: 'In Review',
    description: "Your file is in the underwriter's queue and is under active review.",
  },
  {
    key: 'initial_requirements',
    label: 'Initial Requirements',
    shortLabel: 'Requirements',
    description: 'The underwriter has reviewed your file and requires additional information to proceed.',
  },
  {
    key: 'followup_requirements',
    label: 'Follow-up Requirements',
    shortLabel: 'Follow-up',
    description: 'Additional information has been requested following the initial review.',
  },
  {
    key: 'policy_approved',
    label: 'Policy Approved',
    shortLabel: 'Approved',
    description: 'Your application has been approved. Policy documents are being prepared.',
  },
  {
    key: 'delivery_receipt',
    label: 'Delivery Receipt Sent',
    shortLabel: 'Delivery',
    description: 'Your policy contract has been sent. Please sign and return the delivery receipt.',
  },
  {
    key: 'in_force',
    label: 'Coverage In Force',
    shortLabel: 'In Force',
    description: 'Your coverage is active and fully protecting you.',
  },
]

export const STAGE_ORDER: UnderwritingStage[] = STAGES.map((s) => s.key)

export function getStageIndex(stage: UnderwritingStage): number {
  return STAGE_ORDER.indexOf(stage)
}

export type InsurancePlan = {
  id: string
  type: string
  name: string
  carrier: string
  portalUrl: string
  active: boolean
  underwritingStage: UnderwritingStage
  submittedDate: string
  policyNumber?: string
  coverageAmount?: string
  premium?: string
  effectiveDate?: string
  initialRequirements?: RequirementItem[]
  followupRequirements?: RequirementItem[]
  coverageHighlights?: string[]
  advisorNote?: string
}

export const INSURANCE_PLACEHOLDERS: InsurancePlan[] = [
  {
    id: 'life-term-20',
    type: 'Life Insurance',
    name: '20-Year Term Life',
    carrier: 'Canada Life',
    portalUrl: '',
    active: true,
    underwritingStage: 'initial_requirements',
    submittedDate: '2026-04-28',
    coverageAmount: '$1,000,000',
    premium: '$87.00/mo',
    initialRequirements: [
      {
        id: 'req-1',
        label: 'Attending Physician Statement (APS)',
        description: 'Medical records from your family physician covering the past 5 years',
        status: 'submitted',
        submittedDate: '2026-05-10',
      },
      {
        id: 'req-2',
        label: 'Paramedical Examination',
        description: 'Standard blood and urine lab results — completed at your home',
        status: 'received',
      },
      {
        id: 'req-3',
        label: 'Financial Questionnaire',
        description: 'Completed income verification and net worth disclosure form',
        status: 'pending',
      },
    ],
    coverageHighlights: [
      '$1,000,000 death benefit guaranteed for 20 years',
      'Convertible to permanent insurance at any time — no health questions required',
      'Waiver of premium rider: premiums waived if you become totally disabled',
      'Renewable at end of term without medical evidence',
    ],
    advisorNote:
      'The financial questionnaire is the last outstanding item. Once submitted, expect an underwriting decision within 5–7 business days.',
  },
  {
    id: 'ci-manulife',
    type: 'Critical Illness',
    name: 'Critical Illness — 36 Conditions',
    carrier: 'Manulife',
    portalUrl: '',
    active: true,
    underwritingStage: 'received_by_underwriter',
    submittedDate: '2026-05-08',
    coverageAmount: '$250,000',
    premium: '$142.00/mo',
    coverageHighlights: [
      '$250,000 lump-sum benefit paid on diagnosis of a covered condition',
      'Covers 36 critical illnesses including cancer, heart attack, and stroke',
      'Return of premium on death if no claim has been made',
      'Partial benefit available for early-stage cancers and certain covered conditions',
    ],
    advisorNote:
      "Your application is currently in the underwriter's active review queue. No action is required from you at this time. We will be in touch promptly.",
  },
  {
    id: 'di-ia',
    type: 'Income Protection',
    name: 'Disability Insurance',
    carrier: 'iA Financial',
    portalUrl: '',
    active: true,
    underwritingStage: 'followup_requirements',
    submittedDate: '2026-04-15',
    coverageAmount: '$7,500/mo',
    premium: '$198.00/mo',
    initialRequirements: [
      {
        id: 'di-req-1',
        label: 'Proof of Income (T4 / NOA)',
        description: 'Most recent T4 and Notice of Assessment from CRA',
        status: 'received',
      },
      {
        id: 'di-req-2',
        label: 'Business Financial Statements',
        description: '2-year financial statements for your incorporated practice',
        status: 'received',
      },
      {
        id: 'di-req-3',
        label: 'Medical Records',
        description: 'Records from your family physician covering the past 5 years',
        status: 'received',
      },
    ],
    followupRequirements: [
      {
        id: 'di-fu-1',
        label: 'Orthopedic Specialist Report',
        description: 'Report from your orthopedic specialist regarding the 2023 back injury',
        status: 'submitted',
        submittedDate: '2026-05-18',
      },
      {
        id: 'di-fu-2',
        label: 'Income Structure Clarification Letter',
        description:
          'Written explanation of your self-employment income split across your corporation and personal draws',
        status: 'pending',
      },
    ],
    coverageHighlights: [
      '$7,500/month benefit if unable to perform your own occupation',
      'Own-occupation definition of total disability — not "any occupation"',
      '90-day elimination period; benefits payable to age 65',
      'Cost-of-living adjustment rider: monthly benefit increases annually with inflation',
    ],
    advisorNote:
      'The specialist report has been submitted. The income clarification letter is still outstanding — please forward this to our office at your earliest convenience to avoid delays.',
  },
]
