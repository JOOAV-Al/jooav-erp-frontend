import OrderCardSkeleton from "@/features/marketplace/components/OrderCardSkeleton";

/**
 * CheckoutPageSkeleton
 * Matches the admin skeleton pattern: animate-pulse + raw bg-gray divs
 * Replicates the exact 2-column layout of the real ProductDetailPage.
 */
export default function CheckoutPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-pulse">
      {/* Back link */}
      <div className="h-4 w-12 bg-gray-200 rounded mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ── Left: images ─────────────────────────────────────── */}
        <div className="flex flex-col gap-main mt-3">
          {[1].map((_, i) => (
            <OrderCardSkeleton key={i} itemCount={3} />
          ))}
        </div>

        {/* ── Right: details ───────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Product name */}
          <div className="flex flex-col gap-2">
            <div className="h-7 w-3/4 bg-gray-200 rounded" />
            <div className="h-7 w-1/2 bg-gray-200 rounded" />
          </div>

          {/* Description lines */}
          <div className="flex flex-col gap-1.5">
            <div className="h-3.5 w-full bg-gray-100 rounded" />
            <div className="h-3.5 w-full bg-gray-100 rounded" />
            <div className="h-3.5 w-2/3 bg-gray-100 rounded" />
          </div>

          {/* Meta badge pills */}
          <div className="flex items-center gap-2">
            {[60, 80, 50, 64].map((w, i) => (
              <div
                key={i}
                className={`h-6 w-${w === 60 ? 16 : w === 80 ? 20 : w === 50 ? 14 : 16} bg-gray-100 rounded-full`}
              />
            ))}
          </div>

          {/* Quantity row */}
          <div className="flex items-center justify-between border border-border-main rounded-xl px-4 py-3">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-10 bg-gray-100 rounded" />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1 mt-1">
            <div className="h-8 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <div className="h-12 w-full bg-gray-200 rounded-lg" />
            <div className="h-12 w-full bg-gray-100 rounded-lg border border-border-main" />
          </div>

          {/* Legal text */}
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="h-3 w-full bg-gray-100 rounded" />
            <div className="h-3 w-3/4 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
