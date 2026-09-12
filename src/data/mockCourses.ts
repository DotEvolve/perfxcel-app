import type { Course } from "../types";

export const CATEGORIES = ["Engineering", "Design", "Marketing"];

export const MOCK_COURSES: Course[] = [
  {
    id: "eng-1",
    title: "TypeScript Mastery",
    instructor: "Sarah Chen",
    duration: "4h 30m",
    level: "Advanced",
    category: "Engineering",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
  },
  {
    id: "eng-2",
    title: "React 19 Deep Dive",
    instructor: "Alex Rivera",
    duration: "6h 15m",
    level: "Intermediate",
    category: "Engineering",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
  },
  {
    id: "eng-3",
    title: "Node.js Performance",
    instructor: "David Kim",
    duration: "3h 45m",
    level: "Advanced",
    category: "Engineering",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80",
  },
  {
    id: "des-1",
    title: "Figma for Developers",
    instructor: "Emma Watson",
    duration: "2h 20m",
    level: "Beginner",
    category: "Design",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
  },
  {
    id: "des-2",
    title: "Design Systems at Scale",
    instructor: "Michael Chang",
    duration: "5h 10m",
    level: "Advanced",
    category: "Design",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  },
  {
    id: "des-3",
    title: "Motion Design Principles",
    instructor: "Sophie Martin",
    duration: "3h 30m",
    level: "Intermediate",
    category: "Design",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80",
  },
  {
    id: "mar-1",
    title: "SEO Fundamentals",
    instructor: "James Wilson",
    duration: "4h 00m",
    level: "Beginner",
    category: "Marketing",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80",
  },
  {
    id: "mar-2",
    title: "Growth Marketing",
    instructor: "Elena Rodriguez",
    duration: "5h 45m",
    level: "Intermediate",
    category: "Marketing",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
  },
  {
    id: "mar-3",
    title: "Content Strategy",
    instructor: "William Taylor",
    duration: "3h 15m",
    level: "Intermediate",
    category: "Marketing",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  },
];
