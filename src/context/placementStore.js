import { createContext, useContext } from "react";

export const PlacementContext = createContext(null);

export function usePlacement() {
  const context = useContext(PlacementContext);

  if (!context) {
    throw new Error("usePlacement must be used inside PlacementProvider");
  }

  return context;
}
