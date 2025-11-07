import { fetchPostsByTopicSlug } from '@/app/db/queries/posts';
import PostCreateForm from '@/components/posts/post-create-form';
import PostList from '@/components/posts/post-list';


interface TopicShowPageProps {
  params: {
    slug: string;
  };
}

export default function TopicShowPage({ params }: TopicShowPageProps) {
  const { slug } = params;

  return (
    // make the grid use the available height and let columns scroll independently
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="col-span-3">
        <h1 className="text-2xl font-bold mb-2">{slug}</h1>
        <div className="overflow-y-auto max-h-[600px]">
          <PostList fetchData={() => fetchPostsByTopicSlug(slug)} />
        </div>
      </div>

      <div>
        <div className="overflow-y-auto max-h-[600px]">
          <PostCreateForm slug={slug} />
        </div>
      </div>
    </div>
  );
}
