import { create } from 'zustand'

interface AIChatbotState {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

export const useAIChatbotStore = create<AIChatbotState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}))
