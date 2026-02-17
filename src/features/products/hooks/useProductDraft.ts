"use client";

import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";

const DRAFT_KEY = "product-form-draft";

export function useProductDraft(
  form: UseFormReturn<any>,
  isEditMode: boolean,
) {
  const { watch } = form;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Auto-save on every change (debounced 800ms, create mode only) ─────────
  useEffect(() => {
    if (isEditMode) return;

    const subscription = watch((values) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const { thumbnail, images, ...serializable } = values;
        const hasContent = Object.values(serializable).some(
          (v) => v !== "" && v !== undefined && v !== null,
        );
        if (hasContent) {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(serializable));
        }
      }, 800);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [isEditMode, watch]);

  /**
   * Read the saved draft from localStorage.
   * Returns the parsed object or null — the CALLER decides what to do with it.
   * This way the hook never fights with the form's own reset() calls.
   */
  const readDraft = (): Record<string, any> | null => {
    if (isEditMode) return null;
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
  };

  const hasDraft = (): boolean => {
    if (isEditMode) return false;
    return !!localStorage.getItem(DRAFT_KEY);
  };

  const clearDraft = () => localStorage.removeItem(DRAFT_KEY);

  const discardDraft = (resetFn: (values: any) => void, emptyValues: any) => {
    localStorage.removeItem(DRAFT_KEY);
    resetFn(emptyValues);
  };

  return { readDraft, hasDraft, clearDraft, discardDraft };
}