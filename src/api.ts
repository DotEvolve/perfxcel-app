import axios from "axios";
import type { Course, TaxonomyItem, CourseFilters } from "./types/course";

export type { Course, TaxonomyItem };

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api-dev.perfxcel.com/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getCourses = async (
  filters: CourseFilters = {},
): Promise<Course[]> => {
  const params = new URLSearchParams();
  if (filters.category_id) params.append("category_id", filters.category_id);
  if (filters.city_id) params.append("city_id", filters.city_id);
  if (filters.association_id) params.append("association_id", filters.association_id);
  if (filters.delivery_mode_id) params.append("delivery_mode_id", filters.delivery_mode_id);

  const response = await api.get(`/courses?${params.toString()}`);
  return response.data.data.filter((c: Course) => c.is_published);
};

export const getCourse = async (id: string): Promise<Course> => {
  const response = await api.get(`/courses/${id}`);
  return response.data.data;
};

export const getTaxonomies = async () => {
  const response = await api.get("/taxonomies");
  return response.data.data;
};

export const submitCourseInterest = async (
  courseId: string,
  data: { name: string; email: string; phone?: string; company?: string },
  turnstileToken: string
) => {
  const response = await api.post(`/courses/${courseId}/interest`, { ...data, turnstileToken });
  return response.data;
};

export const verifyCertificate = async (credentialId: string, turnstileToken: string) => {
  const response = await api.post("/verify", { credential_id: credentialId, turnstileToken });
  return response.data.data;
};
