export interface HeroContent {
  eyebrow: string
  headline: string
  headlineItalic: string
  subline: string
  ctaPrimary: { label: string; href: string }
  bgVideo: string
}

export interface Stat {
  v: string
  l: string
  d?: string
}

export interface Benefit {
  n: string
  ic: string
  t: string
  d: string
}

export interface SimulatorConfig {
  monthlyRate: number
  montoMin: number
  montoMax: number
  montoStep: number
  montoDefault: number
  plazoMin: number
  plazoMax: number
  plazoStep: number
  plazoDefault: number
  quickAmounts: number[]
  rangeSubtext: string
  waNumber: string
}

export interface Step {
  n: string
  t: string
  d: string
}

export interface Service {
  ic: string
  t: string
  d: string
}

export interface CoverageContent {
  eyebrow: string
  headline: string
  intro: string
  locations: { city: string; region: string }[]
  requirements: { icon: string; label: string }[]
}

export interface AboutContent {
  eyebrow: string
  headline: string
  body: string
  cta: { label: string; href: string }
  image: string
  values: { icon: string; title: string; text: string }[]
}

export interface Testimonial {
  i: string
  n: string
  q: string
}

export interface VideoItem {
  t: string
  poster: string
  url: string
}

export interface ContactQuestion {
  id: string
  label: string
  type: 'text' | 'boolean'
}

export interface JobOpening {
  title: string
  modality: string
  location: string
  description: string
  active: boolean
  publishedAt: string
  salary?: string
}

// Careers rebuild — jobs.json holds only the fields that vary per city; the
// shared role fields (title/modality/description/salary/active) live in
// `ADVISOR_ROLE` (src/data/index.ts) and get spread over each input.
export type JobOpeningInput = Pick<JobOpening, 'location' | 'publishedAt'>

export interface FaqItem {
  q: string
  a: string
}

export interface JobsPageContent {
  whySolvia: { icon: string; title: string; text: string }[]
  expectations: { icon: string; label: string }[]
}

export interface JobApplicationContent {
  greeting: string
  teaser: string
  waIntroTemplate: string
  waIntroGeneric: string
  questions: ContactQuestion[]
}

export interface LegalSection {
  heading: string
  body: string
}

export interface LegalDocument {
  id: string
  title: string
  updatedAt: string
  sections: LegalSection[]
}

export interface LegalContent {
  eyebrow: string
  title: string
  subtitle: string
  documents: LegalDocument[]
}

export interface ContactContent {
  eyebrow: string
  headline: string
  headlineItalic: string
  subtext: string
  phone: string
  telHref: string
  waNumber: string
  waIntro: string
  assistantName: string
  assistantRole: string
  greeting: string
  teaser: string
  questions: ContactQuestion[]
  email: string
  social: { instagram: string; facebook: string }
  cnpj?: string
  bcbNotice?: string
  bcbLink?: string
  ombudsmanEmail?: string
  sacPhone?: string
  privacyPolicyHref?: string
  termsHref?: string
  cetNotice?: string
}
