import { create } from "zustand";

export const useLimitStore = create((set) => ({
  maxCorridorWidth: "",
  maxMinApartmentWidth: "",
  maxN: "",
  setMaxCorridorWidth: (val) => set({ maxCorridorWidth: val }),
  setMaxMinApartmentWidth: (val) => set({ maxMinApartmentWidth: val }),
  setMaxN: (val) => set({ maxN: val }),
}));
