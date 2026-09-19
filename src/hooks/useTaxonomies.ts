import { useTaxonomyContext } from "../contexts/TaxonomyContext";

export function useTaxonomies() {
  return useTaxonomyContext();
}
