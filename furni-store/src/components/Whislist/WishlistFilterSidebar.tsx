import React from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter as FilterIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export type SortOption =
  | "default"
  | "title"
  | "price-low-high"
  | "price-high-low";

export type Filters = {
  category: string[];
  material: string[];
};

interface ProductFilterSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function WishlistFilterSidebar({
  filters,
  setFilters,
  sort,
  onSortChange,
}: ProductFilterSidebarProps) {
  const categories = ["Office", "Living Room", "Bedroom", "Dining Room"];
  const materials = ["Wood", "Leather", "Fabric", "Wood and Metal"];

  const toggleFilter = (type: keyof Filters, value: string) => {
    setFilters((prev) => {
      const current = new Set(prev[type]);
      if (current.has(value)) {
        current.delete(value);
      } else {
        current.add(value);
      }
      return { ...prev, [type]: Array.from(current) };
    });
  };

  // Mobile: Sheet for filters
  return (
    <>
      {/* Mobile filter icon button and sheet */}
      <div className="md:hidden p-4 flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="md:w-50"
              aria-label="Open filters"
            >
              Filter <FilterIcon className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="max-w-xs p-4">
            <SheetHeader>
              <span className="text-lg font-semibold flex items-center gap-2">
                <FilterIcon className="w-5 h-5" /> Filters
              </span>
            </SheetHeader>
            <div className="flex flex-col gap-6 mt-4">
              <div>
                <h3 className="text-base font-semibold mb-2">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <label key={c} className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(c)}
                        onChange={() => toggleFilter("category", c)}
                        className="accent-black"
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2">Material</h3>
                <div className="flex flex-wrap gap-2">
                  {materials.map((m) => (
                    <label key={m} className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={filters.material.includes(m)}
                        onChange={() => toggleFilter("material", m)}
                        className="accent-black"
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>
              {/* Sort by (RadioGroup) */}
              <div>
                <h3 className="px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase mb-2">
                  Sort by
                </h3>
                <RadioGroup
                  value={sort}
                  onValueChange={onSortChange}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="default" id="sort-default" />
                    <Label htmlFor="sort-default">Default</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="title" id="sort-title" />
                    <Label htmlFor="sort-title">Title</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="price-low-high" id="sort-low-high" />
                    <Label htmlFor="sort-low-high">Price: Low to High</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="price-high-low" id="sort-high-low" />
                    <Label htmlFor="sort-high-low">Price: High to Low</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* Desktop sidebar with Accordion */}
      <div className="hidden md:block p-4">
        <Accordion type="multiple" className="w-full space-y-1">
          <AccordionItem value="category">
            <AccordionTrigger className="px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Category
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {categories.map((c) => (
                  <label
                    key={c}
                    className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.category.includes(c)}
                      onChange={() => toggleFilter("category", c)}
                      className="mr-2 accent-black"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="material">
            <AccordionTrigger className="px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Material
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {materials.map((m) => (
                  <label
                    key={m}
                    className="flex items-center gap-2 px-2 py-1 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.material.includes(m)}
                      onChange={() => toggleFilter("material", m)}
                      className="mr-2 accent-black"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="sort">
            <AccordionTrigger className="px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Sort by
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={sort}
                onValueChange={onSortChange}
                className="flex flex-col gap-2 px-2"
              >
                <div className="flex items-center gap-2 px-2 py-1">
                  <RadioGroupItem value="default" id="sort-default-desktop" />
                  <Label
                    htmlFor="sort-default-desktop"
                    className="text-sm text-muted-foreground font-normal cursor-pointer"
                  >
                    Default
                  </Label>
                </div>
                <div className="flex items-center gap-2 px-2 py-1">
                  <RadioGroupItem value="title" id="sort-title-desktop" />
                  <Label
                    htmlFor="sort-title-desktop"
                    className="text-sm text-muted-foreground font-normal cursor-pointer"
                  >
                    Title
                  </Label>
                </div>
                <div className="flex items-center gap-2 px-2 py-1">
                  <RadioGroupItem
                    value="price-low-high"
                    id="sort-low-high-desktop"
                  />
                  <Label
                    htmlFor="sort-low-high-desktop"
                    className="text-sm text-muted-foreground font-normal cursor-pointer"
                  >
                    Price: Low to High
                  </Label>
                </div>
                <div className="flex items-center gap-2 px-2 py-1">
                  <RadioGroupItem
                    value="price-high-low"
                    id="sort-high-low-desktop"
                  />
                  <Label
                    htmlFor="sort-high-low-desktop"
                    className="text-sm text-muted-foreground font-normal cursor-pointer"
                  >
                    Price: High to Low
                  </Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
