import { useState, useEffect } from "react";
import { getCourses } from "../api";
import type { Course, CourseFilters } from "../types/course";

export function useCourses(filters: CourseFilters, skip: boolean = false) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skip) return;
    setLoading(true);
    getCourses(filters)
      .then(setCourses)
      .catch(() => setError("Failed to load courses"))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters), skip]);

  return { courses, loading, error };
}
