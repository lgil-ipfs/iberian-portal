export type Bank = {
  id: string
  name: string
  portalUrl: string
  logo: string
}

export const CANADIAN_BANKS: Bank[] = [
  {
    id: 'td',
    name: 'TD Canada Trust',
    portalUrl: 'https://www.td.com/ca/en/personal-banking',
    logo: 'TD',
  },
  {
    id: 'rbc',
    name: 'Royal Bank of Canada',
    portalUrl: 'https://www.rbcroyalbank.com',
    logo: 'RBC',
  },
  {
    id: 'bmo',
    name: 'Bank of Montreal',
    portalUrl: 'https://www.bmo.com/en-ca/main/personal',
    logo: 'BMO',
  },
  {
    id: 'scotiabank',
    name: 'Scotiabank',
    portalUrl: 'https://www.scotiabank.com/ca/en/personal.html',
    logo: 'Scotia',
  },
  {
    id: 'cibc',
    name: 'CIBC',
    portalUrl: 'https://www.cibc.com/en/personal-banking.html',
    logo: 'CIBC',
  },
  {
    id: 'national',
    name: 'National Bank',
    portalUrl: 'https://www.nbc.ca/personal.html',
    logo: 'NBC',
  },
  {
    id: 'tangerine',
    name: 'Tangerine',
    portalUrl: 'https://www.tangerine.ca',
    logo: 'Tang',
  },
  {
    id: 'simplii',
    name: 'Simplii Financial',
    portalUrl: 'https://www.simplii.com',
    logo: 'Simplii',
  },
  {
    id: 'vancity',
    name: 'Vancity',
    portalUrl: 'https://www.vancity.com',
    logo: 'Vancity',
  },
  {
    id: 'coastcapital',
    name: 'Coast Capital',
    portalUrl: 'https://www.coastcapitalsavings.com',
    logo: 'Coast',
  },
]
