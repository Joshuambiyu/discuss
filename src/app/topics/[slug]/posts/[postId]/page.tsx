import Link from 'next/link';
import PostShow from '@/components/posts/post-show';

import paths from '@/paths';
import CommentCreateForm from '@/components/comments/comment-create-form';
import { fetchCommentsByPostId } from '@/app/db/queries/comments';
import CommentList from '@/components/comments/comment-list';
import { Suspense } from 'react';

interface PostShowPageProps {
  params: {
    slug: string;
    postId: string;
  };
}

export default async function PostShowPage({ params }: PostShowPageProps) {
  const { slug, postId } = params;

  return (
    <div className="space-y-3">
      <Link className="underline decoration-solid" href={paths.topicShow(slug)}>
        {'< '}Back to {slug}
      </Link>
      <Suspense fallback={<div>Loading post...</div>}>
        <PostShow postId={postId} />
      </Suspense>
      <CommentCreateForm postId={postId} startOpen />
      <CommentList postId={postId} />
    </div>
  );
}
