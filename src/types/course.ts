export interface TaxonomyItem {
  id: string;
  name: string;
}

export interface TaxonomyCollection {
  categories: TaxonomyItem[];
  cities: TaxonomyItem[];
  associations: TaxonomyItem[];
  delivery_modes: TaxonomyItem[];
}

export interface CourseSchedule {
  id: string;
  course_id: string;
  start_date: string;
  end_date: string | null;
  location: string | null;
  method: string | null;
  status: 'open' | 'guaranteed' | 'filling_fast' | 'closed' | 'cancelled';
}

export interface Course {
  id: string;
  slug?: string;
  title: string;
  description: string;
  objectives: string;
  target_audience: string;
  is_published: boolean;
  cost: number | null;
  duration: string | null;
  categories?: TaxonomyItem[];
  cities?: TaxonomyItem[];
  associations?: TaxonomyItem[];
  delivery_modes?: TaxonomyItem[];
  course_schedules?: CourseSchedule[];
  is_blended?: boolean;
}

export interface CourseFilters {
  category_id?: string;
  city_id?: string;
  association_id?: string;
  delivery_mode_id?: string;
  search?: string;
  page?: number;
  limit?: number;
}
