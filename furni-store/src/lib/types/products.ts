import { z } from "zod";
  
export const productSchema = z.object({
  _id: z.string(),
  title: z.string(),
  category: z.string(),
  material: z.string(),
  price: z.number(),
  images: z.array(z.string()),
  description: z.string().optional(),
  rating: z.number().optional(),
});

export const productsSchema = z.array(productSchema);

export type Product = z.infer<typeof productSchema>;

export type SortOption =
  | "default"
  | "title"
  | "price-low-high"
  | "price-high-low";

export type Filters = {
  category: string[];
  material: string[];
};

export const INDIAN_STATES = [
  "Maharashtra",
  "Tamil Nadu",
  "Gujarat",
  "Karnataka",
  "Uttar Pradesh",
  "West Bengal",
  "Telangana",
] as const;

export const addressSchema = z.object({
  street: z
    .string()
    .min(5, "Street address must be at least 5 characters")
    .max(100, "Street address cannot exceed 100 characters"),
  city: z
    .string()
    .min(2, "City name must be at least 2 characters")
    .max(50, "City name cannot exceed 50 characters"),
  state: z.enum(INDIAN_STATES),
  zipCode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit PIN code"),
  country: z.literal("India"),
  isDefault: z.boolean().default(false),
});

export type Address = z.infer<typeof addressSchema>;
