import { create } from "zustand";

export const useParamStore = create((set) => ({
  houseWidth: "",
  houseHeight: "",
  corridorWidth: "",
  minApartmentWidth: "",
  maxApartmentWidth: "",
  n: 0,
  isRandom: false,
  setHouseWidth: (val) => set({ houseWidth: val }),
  setHouseHeight: (val) => set({ houseHeight: val }),
  setCorridorWidth: (val) => set({ corridorWidth: val }),
  setMinApartmentWidth: (val) => set({ minApartmentWidth: val }),
  setMaxApartmentWidth: (val) => set({ maxApartmentWidth: val }),
  setN: (val) => set({ n: val }),
  setRandom: (val) => set({ isRandom: val }),
}));
