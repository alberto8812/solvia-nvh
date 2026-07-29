export const CHAT_OPEN_EVENT = 'solvia:open-chat'

export interface ChatOpenSeed {
  monto?: string
  plazoDias?: number
  mode?: 'loan' | 'application'
  jobTitle?: string
}

export function openSolviaChat(seed?: ChatOpenSeed) {
  window.dispatchEvent(new CustomEvent(CHAT_OPEN_EVENT, { detail: seed }))
}
