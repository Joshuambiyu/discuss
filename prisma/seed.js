const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const seedUserId = process.env.SEED_USER_ID;
  const seedUserEmail = process.env.SEED_USER_EMAIL || 'seed@example.com';

  // Try to find existing user by id or email. If not found, create one.
  let user = null;
  if (seedUserId) {
    user = await prisma.user.findUnique({ where: { id: seedUserId } });
  }
  if (!user && seedUserEmail) {
    user = await prisma.user.findUnique({ where: { email: seedUserEmail } });
  }

  if (!user) {
    console.log(`No user found for id=${seedUserId || '-'} email=${seedUserEmail}. Creating seed user.`);
    user = await prisma.user.create({
      data: {
        name: 'Seed User',
        email: seedUserEmail,
        image: null,
      },
    });
  } else {
    console.log(`Seeding as existing user: id=${user.id} email=${user.email}`);
  }

  // Create topics (if not already existing)
  const topicSlugs = ['general', 'programming', 'prisma', 'nextjs', 'devops'];
  const topics = [];
  for (const slug of topicSlugs) {
    const t = await prisma.topic.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        description: `${slug} related discussions`,
      },
    });
    topics.push(t);
  }

  // Create posts per topic
  const POSTS_PER_TOPIC = parseInt(process.env.POSTS_PER_TOPIC || '20', 10); // default 20
  const COMMENTS_PER_POST = parseInt(process.env.COMMENTS_PER_POST || '5', 10); // default 5

  for (const topic of topics) {
    for (let i = 0; i < POSTS_PER_TOPIC; i++) {
      const title = `${topic.slug} - Seed post ${i + 1}`;
      const content = `This is seed content for ${title}. Generated at ${new Date().toISOString()}`;

      const post = await prisma.post.create({
        data: {
          title,
          content,
          userId: user.id,
          topicId: topic.id,
        },
      });

      // Create some comments for the post
      for (let c = 0; c < COMMENTS_PER_POST; c++) {
        const comment = await prisma.comment.create({
          data: {
            content: `Seed comment ${c + 1} on ${title}`,
            postId: post.id,
            userId: user.id,
          },
        });

        // Create 0-2 child comments for more realistic threads
        const childCount = c % 3 === 0 ? 2 : 0;
        for (let cc = 0; cc < childCount; cc++) {
          await prisma.comment.create({
            data: {
              content: `Reply ${cc + 1} to comment ${comment.id}`,
              postId: post.id,
              userId: user.id,
              parentId: comment.id,
            },
          });
        }
      }
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
