import { create } from "zustand";

export const useLimitStore = create((set) => ({
  maxCorridorWidth: "",
  minApartmentWidthLimit: "",
  maxApartmentWidthLimit: "",
  maxN: "",
  minN: "",
  setMaxCorridorWidth: (val) => set({ maxCorridorWidth: val }),
  setMinApartmentWidthLimit: (val) => set({ minApartmentWidthLimit: val }),
  setMaxApartmentWidthLimit: (val) => set({ maxApartmentWidthLimit: val }),
  setMaxN: (val) => set({ maxN: val }),
  setMinN: (val) => set({ minN: val }),
}));
