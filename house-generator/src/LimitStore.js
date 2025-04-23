import { create } from "zustand";

export const useLimitStore = create((set) => ({
  maxCorridorWidth: "",
  minApartmentWidthLowerLimit: "",
  minApartmentWidthLimit: "",
  maxApartmentWidthLowerLimit: "",
  maxApartmentWidthLimit: "",
  maxN: "",
  minN: "",
  setMaxCorridorWidth: (val) => set({ maxCorridorWidth: val }),
  setMinApartmentWidthLowerLimit: (val) =>
    set({ minApartmentWidthLowerLimit: val }),
  setMinApartmentWidthLimit: (val) => set({ minApartmentWidthLimit: val }),
  setMaxApartmentWidthLowerLimit: (val) =>
    set({ maxApartmentWidthLowerLimit: val }),
  setMaxApartmentWidthLimit: (val) => set({ maxApartmentWidthLimit: val }),
  setMaxN: (val) => set({ maxN: val }),
  setMinN: (val) => set({ minN: val }),
}));
