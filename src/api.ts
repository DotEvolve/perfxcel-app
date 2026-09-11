import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

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

export interface TaxonomyItem {
  id: string;
  name: string;
}

export const getCourses = async (filters: { category_id?: string, city_id?: string, association_id?: string } = {}): Promise<Course[]> => {
  const params = new URLSearchParams();
  if (filters.category_id) params.append('category_id', filters.category_id);
  if (filters.city_id) params.append('city_id', filters.city_id);
  if (filters.association_id) params.append('association_id', filters.association_id);
  
  const response = await api.get(`/courses?${params.toString()}`);
  return response.data.data.filter((c: Course) => c.is_published);
};

export const getCourse = async (id: string): Promise<Course> => {
  const response = await api.get(`/courses/${id}`);
  return response.data.data;
};

export const getTaxonomies = async () => {
  const response = await api.get('/taxonomies');
  return response.data.data;
};
