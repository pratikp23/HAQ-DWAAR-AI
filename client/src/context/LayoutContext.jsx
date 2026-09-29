import React, { createContext, useContext } from "react";

export const LayoutContext = createContext({
  inLayout: false,
  layoutType: null, // "public" | "citizen" | "admin"
});

export const useLayout = () => useContext(LayoutContext);
