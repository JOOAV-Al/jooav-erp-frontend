"use client";

import { useMarketplaceFilters } from "@/features/marketplace/hooks/useMarketplaceFilters";
import {
  useFetchCategories,
  useFetchProducts,
  useGetOrderDetails,
} from "@/features/marketplace/services/marketplace.api";
import SearchBar from "@/features/marketplace/components/SearchBar";
import CategoryTabs from "@/features/marketplace/components/CategoryTabs";
import ProductCard from "@/features/marketplace/components/ProductCard";
import ProductCardSkeleton from "@/features/marketplace/components/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/features/marketplace/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import EmptyState from "@/components/general/EmptyState";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

// "All categories" sentinel
const ALL_SLUG = "__all__";

export default function MarketplacePageComponent() {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();
    const [page, setPage] = useState<number>(1);
    const [query, setQuery] = useState<string>("");
    const debouncedQuery = useDebounce(query)
  // const {
  //   products,
  //   isLoading,
  //   isFetching,
  //   handleSearch,
  //   committedFilters,
  //   handleCategorySelect,
  // } = useMarketplaceFilters();
    const {
      data: productsData,
      isLoading,
      isFetching,
    } = useFetchProducts({
      search: debouncedQuery,
      page,
      status: "LIVE"
    });
    const products = productsData?.data ?? [];

  const { data: categoriesData, isLoading: categoriesLoading } =
    useFetchCategories();

  const draftCart = auth.cartDraftNumber;
  const { data, refetch } = useGetOrderDetails({
    orderNumber: draftCart ?? "",
  });
  const userDraftCart = data?.data;

  // const cartTotal = useSelector((state: RootState) =>
  //   state.cart.items.reduce((sum, i) => sum + i.qty, 0),
  // );

  // Build category tab list from API
  const categories = [
    // { label: "Find by categories", slug: ALL_SLUG },
    ...(categoriesData?.data?.map((c) => ({ label: c.name, slug: c.id })) ??
      []),
  ];

  const handleCategorySelect = (slug: string) => {
    // handleCategorySelect(slug === ALL_SLUG ? "" : slug);
    if (slug !== ALL_SLUG) {
      router.push(`/marketplace/${slug}`);
    }
  };

  // // Map active categoryId back to the tab slug
  // const activeTabSlug = committedFilters.categoryId
  //   ? committedFilters.categoryId
  //   : ALL_SLUG;

  return (
    <div className="flex flex-col">
      {/* Hero */}

      <div className="flex flex-col gap-sm pt-lg mdx:pt-2xl pb-lg">
        <div className="flex flex-col items-center text-center gap-md py-main mdx:py-xl">
          <h1 className="text-[24px] mdx:text-[32px] font-semibold leading-[1.2] tracking-[0.01em]">
            <span className="text-brand-primary">
              Find FMCG Products with ease,
            </span>
            <br />
            <span className="text-brand-signal">Restock</span>{" "}
            <span className="text-brand-primary">your inventory.</span>
          </h1>
          <SearchBar
            className="max-w-[600px] w-full"
            placeholder="Search product names"
            onSearch={setQuery}
            navigateOnSearch={false}
          />
        </div>

        {/* Category tabs */}
        {categoriesLoading ? (
          <div className="flex items-center gap-2 h-[63px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[27px] max-w-24 2-full rounded-md"
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <button
              className={cn(
                // Base — matches admin TabsTrigger
                "inline-flex items-center justify-center whitespace-nowrap",
                "rounded-md border border-transparent h-[42px] p-md",
                "text-[15px] font-semibold leading-[1.2] tracking-[0.04em] cursor-pointer",
                "transition-[color,box-shadow]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50",
                // Inactive state — matches admin text-body
                "text-body font-medium",
                "bg-storey-foreground! text-heading font-semibold tracking-[0.02em]",
                "shadow-sm border-border-main table-tag",
              )}
            >
              Find by categories
            </button>
            <CategoryTabs
              categories={categories}
              // activeSlug={activeTabSlug}
              onSelect={handleCategorySelect}
            />
          </div>
        )}
      </div>

      {/* Product grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <EmptyState
            header="No products found"
            description="Try a different search or category."
          />
        </div>
      ) : (
        <div
          className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-[16px] py-sm transition-opacity ${
            isFetching ? "opacity-60" : "opacity-100"
          }`}
        >
          {products.map((product: Product) => (
            <ProductCard
              userDraftCart={userDraftCart}
              refetch={refetch}
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                variant: product.variant?.name,
                price: Number(product.price),
                image: product.thumbnail || product.images?.[0] || "",
                currency: "NGN",
                size: product.packSize?.name,
                type: product.packType?.name,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
