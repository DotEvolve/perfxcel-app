export interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  overview?: string | null;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  thumbnailUrl?: string;
}
