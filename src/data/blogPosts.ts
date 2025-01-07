export type BlogPost = {
  title: string;
  date: string;
  path: string;
  description?: string;
};

export const blogPosts: BlogPost[] = [
  {
    title: "Understanding Different Types of Gravel for Your Driveway",
    date: "March 15, 2024",
    path: "/blog/gravel-types",
  },
  {
    title: "Concrete vs Asphalt: Making the Right Choice",
    date: "March 10, 2024",
    path: "/blog/concrete-vs-asphalt",
  },
  {
    title: "Professional Paver Installation Guide",
    date: "March 5, 2024",
    path: "/blog/paver-installation",
  },
];

export function getRecentPosts(excludePath?: string, limit = 5) {
  return blogPosts
    .filter(post => post.path !== excludePath)
    .slice(0, limit);
}