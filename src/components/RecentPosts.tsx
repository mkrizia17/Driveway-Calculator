import Link from 'next/link';

export type RecentPost = {
  title: string;
  date: string;
  path: string;
};

interface RecentPostsProps {
  posts: RecentPost[];
}

export function RecentPosts({ posts }: RecentPostsProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-blue-400">Recent Posts</h2>
      <div className="space-y-6">
        {posts.map((post, index) => (
          <div key={index} className="border-l-4 border-blue-400 pl-4">
            <Link href={post.path} className="block hover:text-blue-400 transition-colors">
              <h4 className="font-semibold mb-2 text-gray-300">{post.title}</h4>
              <p className="text-sm text-gray-400">{post.date}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 