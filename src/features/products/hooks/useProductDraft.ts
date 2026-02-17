// "use client";

// import { useEffect, useRef } from "react";
// import { UseFormReturn } from "react-hook-form";

// const DRAFT_KEY = "product-form-draft";

// export function useProductDraft(
//   form: UseFormReturn<any>,
//   isEditMode: boolean,
// ) {
//   const { watch } = form;
//   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   // ── Auto-save on every change (debounced 800ms, create mode only) ─────────
//   useEffect(() => {
//     if (isEditMode) return;

//     const subscription = watch((values) => {
//       if (debounceRef.current) clearTimeout(debounceRef.current);

//       debounceRef.current = setTimeout(() => {
//         const { thumbnail, images, ...serializable } = values;
//         const hasContent = Object.values(serializable).some(
//           (v) => v !== "" && v !== undefined && v !== null,
//         );
//         if (hasContent) {
//           localStorage.setItem(DRAFT_KEY, JSON.stringify(serializable));
//         }
//       }, 800);
//     });

//     return () => {
//       subscription.unsubscribe();
//       if (debounceRef.current) clearTimeout(debounceRef.current);
//     };
//   }, [isEditMode, watch]);

//   /**
//    * Read the saved draft from localStorage.
//    * Returns the parsed object or null — the CALLER decides what to do with it.
//    * This way the hook never fights with the form's own reset() calls.
//    */
//   const readDraft = (): Record<string, any> | null => {
//     if (isEditMode) return null;
//     const saved = localStorage.getItem(DRAFT_KEY);
//     if (!saved) return null;
//     try {
//       return JSON.parse(saved);
//     } catch {
//       localStorage.removeItem(DRAFT_KEY);
//       return null;
//     }
//   };

//   const hasDraft = (): boolean => {
//     if (isEditMode) return false;
//     return !!localStorage.getItem(DRAFT_KEY);
//   };

//   const clearDraft = () => localStorage.removeItem(DRAFT_KEY);

//   const discardDraft = (resetFn: (values: any) => void, emptyValues: any) => {
//     localStorage.removeItem(DRAFT_KEY);
//     resetFn(emptyValues);
//   };

//   return { readDraft, hasDraft, clearDraft, discardDraft };
// }

















"use client";

import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";

const DRAFT_KEY = "product-form-draft";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function dataUrlToFile(stored: { dataUrl: string; name: string; type: string }): Promise<File> {
  const res  = await fetch(stored.dataUrl);
  const blob = await res.blob();
  return new File([blob], stored.name, { type: stored.type });
}

interface StoredFileRef { dataUrl: string; name: string; type: string; }

// ─────────────────────────────────────────────────────────────────────────────

export function useProductDraft(form: UseFormReturn<any>, isEditMode: boolean) {
  const { watch } = form;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Auto-save on every change, debounced 800ms (create mode only) ─────────
  useEffect(() => {
    if (isEditMode) return;

    const subscription = watch(async (values) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        const { thumbnail, images, ...textFields } = values;

        const hasContent = Object.values(textFields).some(
          (v) => v !== "" && v !== undefined && v !== null,
        );
        if (!hasContent) return;

        // Serialise thumbnail → base64 if it's a File
        let storedThumb: StoredFileRef | null = null;
        if (thumbnail instanceof File) {
          storedThumb = {
            dataUrl: await fileToDataUrl(thumbnail),
            name: thumbnail.name,
            type: thumbnail.type,
          };
        }

        // Serialise images — File → base64, string URLs stay as-is
        const storedImages = await Promise.all(
          (images ?? []).map(async (img: File | string) =>
            img instanceof File
              ? { dataUrl: await fileToDataUrl(img), name: img.name, type: img.type }
              : img,
          ),
        );

        localStorage.setItem(DRAFT_KEY, JSON.stringify({
          ...textFields,
          thumbnail: storedThumb,
          images: storedImages,
        }));
      }, 800) as any;
    });

    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) clearTimeout(debounceRef.current as any);
    };
  }, [isEditMode, watch]);

  /**
   * ASYNC — reads draft and reconstructs File objects from stored base64.
   * The caller must await this before calling reset().
   * Returns null if no draft exists or in edit mode.
   */
  const readDraft = async (): Promise<Record<string, any> | null> => {
    if (isEditMode) return null;
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return null;
    try {
      const raw = JSON.parse(saved);

      // Reconstruct thumbnail File
      const thumbnail = raw.thumbnail?.dataUrl
        ? await dataUrlToFile(raw.thumbnail)
        : undefined;

      // Reconstruct image Files
      const images: (File | string)[] = await Promise.all(
        (raw.images ?? []).map((img: StoredFileRef | string) =>
          typeof img === "string" ? img : dataUrlToFile(img),
        ),
      );

      return { ...raw, thumbnail, images };
    } catch {
      localStorage.removeItem(DRAFT_KEY);
      return null;
    }
  };

  const hasDraft     = (): boolean => !isEditMode && !!localStorage.getItem(DRAFT_KEY);
  const clearDraft   = ()          => localStorage.removeItem(DRAFT_KEY);
  const discardDraft = (resetFn: (v: any) => void, emptyValues: any) => {
    localStorage.removeItem(DRAFT_KEY);
    resetFn(emptyValues);
  };

  return { readDraft, hasDraft, clearDraft, discardDraft };
}