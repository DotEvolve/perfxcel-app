import { useState, useEffect } from "react";
import { getCourses } from "../api";
import type { Course, CourseFilters } from "../types/course";

export function useCourses(filters: CourseFilters) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getCourses(filters)
      .then(setCourses)
      .catch(() => setError("Failed to load courses"))
      .finally(() => setLoading(false));
  }, [filters.category_id, filters.city_id, filters.association_id]);

  return { courses, loading, error };
}
