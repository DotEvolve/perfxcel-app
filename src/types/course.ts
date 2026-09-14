export interface TaxonomyItem {
  id: string;
  name: string;
}

export interface TaxonomyCollection {
  categories: TaxonomyItem[];
  cities: TaxonomyItem[];
  associations: TaxonomyItem[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  objectives: string;
  target_audience: string;
  is_published: boolean;
  category_id: string | null;
  city_id: string | null;
  association_id: string | null;
  categories?: TaxonomyItem | null;
  cities?: TaxonomyItem | null;
  associations?: TaxonomyItem | null;
}

export interface CourseFilters {
  category_id?: string;
  city_id?: string;
  association_id?: string;
}
