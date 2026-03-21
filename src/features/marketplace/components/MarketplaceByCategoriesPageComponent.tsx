"use client";

import {
  useFetchProducts,
  useGetCategoryDetails,
  useGetOrderDetails,
} from "@/features/marketplace/services/marketplace.api";
import ProductCard from "@/features/marketplace/components/ProductCard";
import ProductCardSkeleton from "@/features/marketplace/components/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/features/marketplace/types";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import EmptyState from "@/components/general/EmptyState";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useParams } from "next/navigation";
import BreadCrumbs from "@/components/general/BreadCrumbs";

export default function MarketplaceByCategoriesPageComponent() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const auth = useSelector((state: RootState) => state.auth);
  const [priceRange, setPriceRange] = useState("");
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const { data, isLoading, isFetching, isError } = useFetchProducts({
    categoryId,
    priceSort: priceRange,
    subcategoryIds: subcategories.join(",") || undefined,
    status: "LIVE",
  });
  const products = data?.data || [];

  const { data: category, isPending: categoryLoading } = useGetCategoryDetails({
    id: categoryId,
  });

  const draftCart = auth.cartDraftNumber;
  const { data: draft, refetch } = useGetOrderDetails({
    orderNumber: draftCart ?? "",
  });
  const userDraftCart = draft?.data;

  //TODO: Wire redux cart to have the draft cart reflect added items immediately
  const cartTotal = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.qty, 0),
  );

  const handleSubcategoryToggle = (id: string) => {
    setSubcategories((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handlePriceToggle = (val: string) => {
    setPriceRange((prev) => (prev === val ? "" : val));
  };

  const handleClearFilters = () => {
    setPriceRange("");
    setSubcategories([]);
  };

  const hasFiltersApplied = priceRange !== "" || subcategories.length > 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumbs */}
      <BreadCrumbs routes={["Marketplace", category?.name || "Category"]} />
      <div className="flex gap-lg">
        {/* filters */}
        <div className="max-w-53.5 w-full py-main flex flex-col gap-main">
          <div className="flex justify-between gap-[8px] py-sm border-y border-border-main">
            <h4 className="text-body font-semibold">Filters</h4>
            {hasFiltersApplied && (
              <h4
                onClick={handleClearFilters}
                className="cursor-pointer font-semibold text-brand-primary px-sm py-2"
              >
                Clear all
              </h4>
            )}
          </div>
          <div className="flex flex-col gap-md">
            <div className="flex flex-col gap-main">
              <p className="text-body-passive text-xs leading-[1.2] tracking-[0.08em] font-mono uppercase">
                Price
              </p>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-6 px-sm py-5">
                  <Checkbox
                    id="asc"
                    checked={priceRange === "asc"}
                    onCheckedChange={() => handlePriceToggle("asc")}
                  />
                  <Label
                    className="font-medium text-body text-[15px] leading-[1.2] tracking-[0.04em] cursor-pointer"
                    htmlFor="asc"
                  >
                    Lowest to Highest
                  </Label>
                </div>
                <div className="flex items-center gap-6 px-sm py-5">
                  <Checkbox
                    id="desc"
                    checked={priceRange === "desc"}
                    onCheckedChange={() => handlePriceToggle("desc")}
                  />
                  <Label
                    className="font-medium text-body text-[15px] leading-[1.2] tracking-[0.04em] cursor-pointer"
                    htmlFor="desc"
                  >
                    Highest to Lowest
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-main">
              <p className="text-body-passive text-xs leading-[1.2] tracking-[0.08em] font-mono uppercase">
                Sub-categories
              </p>
              {categoryLoading ? (
                <div className="flex flex-col gap-main">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-[20px] w-full rounded-md" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {category?.subcategories?.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center gap-6 px-sm py-5"
                    >
                      <Checkbox
                        checked={subcategories.includes(sub.id)}
                        onCheckedChange={() => handleSubcategoryToggle(sub.id)}
                        value={sub.id}
                        id={sub.id}
                      />
                      <Label
                        className="font-medium text-body text-[15px] leading-[1.2] tracking-[0.04em]"
                        htmlFor={sub.id}
                      >
                        {sub.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 15 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24">
            <EmptyState
              header="No products found"
              description="Try a different search or category."
            />
          </div>
        ) : (
          <div
            className={`flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[16px] py-sm transition-opacity ${
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
    </div>
  );
}
