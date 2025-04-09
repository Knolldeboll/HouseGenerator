import { create } from "zustand";

export const useLimitStore = create((set) => ({
  maxCorridorWidth: 15,
  maxMinApartmentWidth: 5,
  maxN: 5,
  setMaxCorridorWidth: (val) => set({ maxCorridorWidth: val }),
  setMaxMinApartmentWidth: (val) => set({ maxMinApartmentWidth: val }),
  setMaxN: (val) => set({ maxN: val }),
}));
