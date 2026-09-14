import { useState, useEffect } from "react";
import { getTaxonomies } from "../api";
import type { TaxonomyCollection } from "../types/course";

export function useTaxonomies() {
  const [taxonomies, setTaxonomies] = useState<TaxonomyCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getTaxonomies()
      .then(setTaxonomies)
      .catch(() => setError("Failed to load taxonomy data"))
      .finally(() => setLoading(false));
  }, []);

  return { taxonomies, loading, error };
}
