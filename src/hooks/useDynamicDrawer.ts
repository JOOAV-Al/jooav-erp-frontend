"use client";

import { useState } from "react";
import { BULK_FORM_ID } from "./useBulkTabSetup";

/**
 * useDynamicDrawer
 *
 * Tracks which tab is active so DashboardDrawer's footer always targets
 * the correct form. Pair with DrawerTabs' onActiveFormIdChange prop.
 *
 * Usage:
 *   const { activeFormId, onActiveFormIdChange, resetToManual, isBulkTab } =
 *     useDynamicDrawer("my-form-id");
 */
export function useDynamicDrawer(manualFormId: string) {
  const [activeFormId, setActiveFormId] = useState<string>(manualFormId);

  const onActiveFormIdChange = (formId: string | undefined) => {
    setActiveFormId(formId ?? manualFormId);
  };

  /** Call this when opening the drawer to always start on the manual tab */
  const resetToManual = () => setActiveFormId(manualFormId);

  const isBulkTab = activeFormId === BULK_FORM_ID;

  return { activeFormId, onActiveFormIdChange, resetToManual, isBulkTab };
}