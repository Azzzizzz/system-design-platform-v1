export interface Topic {
  slug: string;
  title: string;
  description?: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  order: number;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  topics: {
    slug: string;
    label: string;
    difficulty: "easy" | "medium" | "hard";
  }[];
}
