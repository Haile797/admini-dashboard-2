export type ProductDTO = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  status: "ACTIVE" | "DRAFT";
  categoryId?: string | null;
  imageUrl?: string | null;
};

export type CategoryDTO = {
  id: string;
  name: string;
};
