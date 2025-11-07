import Link from 'next/link';
import paths from '@/paths';
import { PostWithData } from '@/app/db/queries/posts';

interface PostListProps {
  fetchData: () => Promise<PostWithData[]>;
}

export default async function PostList({ fetchData }: PostListProps) {
  const posts = await fetchData();

  const renderedPosts = posts.map((post) => {
    const topicSlug = post.topic.slug;

    if (!topicSlug) {
      throw new Error('Need a slug to link to a post');
    }

    return (
      <div
        key={post.id}
        className="relative bg-white rounded-lg p-2 transition-all duration-200 ease-out group hover:z-50"
      >
        <Link
          href={paths.postShow(topicSlug, post.id)}
          className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transform transition-all duration-200 group-hover:scale-105 group-hover:shadow-xl"
        >
          <h3 className="text-lg font-bold">{post.title}</h3>

          {/* Render a clamped content snippet so long posts don't break layout */}
          <p
            className="text-sm text-gray-700 mt-2"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxHeight: '4.5rem', // approx 3 lines * 1.5rem line-height
            }}
          >
            {post.content}
          </p>

          <div className="flex flex-row gap-8 mt-3 items-center">
            <p className="text-xs text-gray-400">By {post.user.name}</p>
            <p className="text-xs text-gray-400">{post._count.comments} comments</p>
          </div>
        </Link>
      </div>
    );
  });

  return <div className="space-y-2">{renderedPosts}</div>;
}
