// Proposal-related TypeScript interfaces
// Used for static proposal content display

export interface BaseBlock {
  id: string
  heading?: string
}

export interface TextBlock extends BaseBlock {
  type: 'text'
  text: string
}

export interface ListBlock extends BaseBlock {
  type: 'list'
  list: string[]
}

export interface RevenueBlock extends BaseBlock {
  type: 'revenue'
  data: {
    stream: string
    description: string
    target: string
  }[]
  footer: string
}

export interface TimelineBlock extends BaseBlock {
  type: 'timeline'
  data: {
    phase: string
    dates: string
    deliverables: string
  }[]
}

export interface FinancialTermsBlock extends BaseBlock {
  type: 'financial-terms'
  data: {
    term: string
    description: string
    amount: string
  }[]
}

export interface KpiBlock extends BaseBlock {
  type: 'kpi'
  data: {
    title: string
    value: string
    description: string
  }[]
}

export type ProposalBlock = TextBlock | ListBlock | RevenueBlock | TimelineBlock | FinancialTermsBlock | KpiBlock

export interface ProposalSection {
  id: string
  title?: string
  subtitle?: string
  blocks: ProposalBlock[]
}

export interface ProposalClosing {
  title: string
  quote: string
}
