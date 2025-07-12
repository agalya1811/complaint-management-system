import { create } from 'zustand';

const useStore = create((set) => ({
  user: null,
  complaints: [],
  setUser: (user) => set({ user }),
  setComplaints: (complaints) => set({ complaints }),
}));

export default useStore;
