/// <reference types="vite/client" />
import axios from "axios";
import { Sentry } from "@dotevolve/error-utils/react";
import type { Course, TaxonomyItem, CourseFilters } from "./types/course";

export type { Course, TaxonomyItem };

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api-dev.perfxcel.com/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Tag every Sentry scope with the correlation ID returned by the API so
// errors can be cross-referenced with server-side traces.
api.interceptors.response.use(
  (response) => {
    const correlationId = response.headers["x-correlation-id"];
    if (correlationId) {
      Sentry.getCurrentScope().setTag("correlation_id", correlationId);
    }
    return response;
  },
  (error) => {
    const status: number | undefined = error.response?.status;
    const url: string = error.config?.url ?? "unknown";
    const method: string = (error.config?.method ?? "unknown").toUpperCase();
    const correlationId: string | undefined =
      error.response?.headers?.["x-correlation-id"];

    Sentry.withScope((scope) => {
      scope.setTag("api.url", url);
      scope.setTag("api.method", method);
      if (status) scope.setTag("api.status_code", String(status));
      if (correlationId) scope.setTag("correlation_id", correlationId);
      scope.setContext("api_error", {
        url,
        method,
        status,
        correlationId,
        baseURL: API_BASE_URL,
      });
      // Only capture server errors and unexpected failures — skip 4xx client
      // errors (validation, auth) as they are expected and not actionable.
      if (!status || status >= 500) {
        Sentry.captureException(error);
      }
    });

    return Promise.reject(error);
  },
);

export const getCourses = async (
  filters: CourseFilters = {},
): Promise<Course[]> => {
  const params = new URLSearchParams();
  if (filters.category_id) params.append("category_id", filters.category_id);
  if (filters.city_id) params.append("city_id", filters.city_id);
  if (filters.association_id)
    params.append("association_id", filters.association_id);
  if (filters.delivery_mode_id)
    params.append("delivery_mode_id", filters.delivery_mode_id);

  params.append("is_public", "true");

  const response = await api.get(`/courses?${params.toString()}`);
  return response.data.data.filter(
    (c: Course) => c.is_published && (!c.status || c.status === "active"),
  );
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
  turnstileToken: string,
) => {
  const response = await api.post(`/courses/${courseId}/interest`, {
    ...data,
    turnstileToken,
  });
  return response.data;
};

export const verifyCertificate = async (
  credentialId: string,
  turnstileToken: string,
) => {
  const response = await api.post("/verify", {
    credential_id: credentialId,
    turnstileToken,
  });
  return response.data.data;
};

export const submitContact = async (data: {
  name: string;
  email: string;
  company?: string;
  message: string;
  course_id?: string;
  turnstileToken: string;
}) => {
  const response = await api.post("/contact", data);
  return response.data;
};

export const requestTrainingPlan = async (data: {
  name: string;
  email: string;
  mobile: string;
  designation?: string;
  company?: string;
  turnstileToken: string;
}) => {
  const response = await api.post("/training-plan/request", data);
  return response.data;
};
