import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getTaxonomies } from "../api";

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

interface TaxonomyContextType {
  taxonomies: TaxonomyCollection | null;
  loading: boolean;
  error: string | null;
}

const TaxonomyContext = createContext<TaxonomyContextType | undefined>(
  undefined,
);

export function TaxonomyProvider({ children }: { children: ReactNode }) {
  const [taxonomies, setTaxonomies] = useState<TaxonomyCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchTaxonomies = async () => {
      try {
        const data = await getTaxonomies();
        if (mounted) {
          setTaxonomies(data);
        }
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load taxonomies");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchTaxonomies();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <TaxonomyContext.Provider value={{ taxonomies, loading, error }}>
      {children}
    </TaxonomyContext.Provider>
  );
}

export function useTaxonomyContext() {
  const context = useContext(TaxonomyContext);
  if (context === undefined) {
    throw new Error(
      "useTaxonomyContext must be used within a TaxonomyProvider",
    );
  }
  return context;
}
