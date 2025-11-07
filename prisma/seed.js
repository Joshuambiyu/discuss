const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Accept multiple emails via SEED_USER_EMAILS (comma separated) or a single SEED_USER_EMAIL
  const seedEmailsEnv = process.env.SEED_USER_EMAILS || process.env.SEED_USER_EMAIL || 'seed@example.com';
  const seedEmails = seedEmailsEnv.split(',').map((s) => s.trim()).filter(Boolean);

  // Create topics once (if not existing)
  // Optionally wipe everything except the seed users (useful to start fresh)
  const WIPE_KEEP_SEED_USERS = !!(process.env.WIPE_KEEP_SEED_USERS && process.env.WIPE_KEEP_SEED_USERS !== '0');
  if (WIPE_KEEP_SEED_USERS) {
    console.log('WIPE_KEEP_SEED_USERS=true — removing all records except specified seed users.');
    // Ensure seed users exist first so we don't accidentally delete them
    for (const email of seedEmails) {
      const u = await prisma.user.findUnique({ where: { email } });
      if (!u) {
        console.log(`Creating seed user ${email} to preserve during wipe.`);
        await prisma.user.create({ data: { email, name: email.split('@')[0], image: null } });
      }
    }

    // Delete all users whose email is not in the seed list (this will cascade and remove their posts/comments/accounts/sessions)
    await prisma.user.deleteMany({ where: { email: { notIn: seedEmails } } });

    // Remove any remaining posts/comments/topics so the DB contains only user records (and other minimal metadata)
    await prisma.comment.deleteMany({}).catch(() => {});
    await prisma.post.deleteMany({}).catch(() => {});
    await prisma.topic.deleteMany({}).catch(() => {});
  }

  // Create topics once (if not existing)
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

  // Seeding configuration (all values can be set via environment variables)
  const POSTS_PER_TOPIC = parseInt(process.env.POSTS_PER_TOPIC || '100', 10); // default 100 per topic
  const COMMENTS_PER_POST = parseInt(process.env.COMMENTS_PER_POST || '20', 10); // default 20 top-level comments
  const REPLIES_PER_COMMENT = parseInt(process.env.REPLIES_PER_COMMENT || '5', 10); // replies per comment
  const MAX_REPLY_DEPTH = parseInt(process.env.MAX_REPLY_DEPTH || '3', 10); // nested reply depth
  const WIPE_BEFORE_SEED = !!(process.env.WIPE_BEFORE_SEED && process.env.WIPE_BEFORE_SEED !== '0');

  console.log('Seeding for users:', seedEmails);
  console.log(`Topics prepared: ${topics.map((t) => t.slug).join(', ')}`);

  // per-user seeding function
  async function seedForUser(seedUserEmail) {
    // find or create user
    let user = await prisma.user.findUnique({ where: { email: seedUserEmail } });
    if (!user) {
      console.log(`No user found for email=${seedUserEmail}. Creating seed user.`);
      user = await prisma.user.create({ data: { name: 'Seed User', email: seedUserEmail, image: null } });
    } else {
      console.log(`Seeding as existing user: id=${user.id} email=${user.email}`);
    }

    if (WIPE_BEFORE_SEED) {
      console.log(`WIPE_BEFORE_SEED=true — deleting posts and comments for user ${user.email} before seeding.`);
      await prisma.comment.deleteMany({ where: { userId: user.id } }).catch(() => {});
      await prisma.post.deleteMany({ where: { userId: user.id } }).catch(() => {});
    }

    // helper: recursively create replies to a parent comment
    async function createRepliesRecursively(postId, parentId, depth) {
      if (depth <= 0) return;
      for (let r = 0; r < REPLIES_PER_COMMENT; r++) {
        const reply = await prisma.comment.create({
          data: {
            content: `Seed reply depth ${MAX_REPLY_DEPTH - depth + 1} #${r + 1} to parent ${parentId}`,
            postId,
            userId: user.id,
            parentId,
          },
        });
        // Recurse to create nested replies
        await createRepliesRecursively(postId, reply.id, depth - 1);
      }
    }

    console.log(`Seeding for ${user.email}: ${topics.length} topics, ${POSTS_PER_TOPIC} posts/topic, ${COMMENTS_PER_POST} comments/post, ${REPLIES_PER_COMMENT} replies/comment, depth ${MAX_REPLY_DEPTH}`);

    // Human-like content helpers
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const sample = (n, arr) => {
      const out = [];
      for (let i = 0; i < n; i++) out.push(rand(arr));
      return out.join(' ');
    };

    const titleTemplates = [
      (t, i) => `Thoughts on ${t}: ${['a quick tip','my experience','what worked'][i%3]}`,
      (t, i) => `How I approached ${t} — post ${i + 1}`,
      (t, i) => `Question about ${t}: best practices?`,
      (t, i) => `${t} roundup — things I learned`,
      (t, i) => `Beginner's notes on ${t}`,
    ];

    const sentenceFragments = [
      'I recently spent some time playing with this and thought I would share what I found.',
      'There are a few quirks to be aware of, especially when dealing with edge cases.',
      'In my setup, this worked consistently, though your mileage may vary.',
      'Documentation is decent, but examples are limited and sometimes outdated.',
      'If you try this, start with a small experiment before rolling it out in production.',
      'I ran into a subtle bug related to async timing that took a while to track down.',
      'The community has some great patterns for this — I linked them below.',
      'Feedback welcome — curious how others are handling this.',
    ];

    const commentStarts = [
      'Nice write-up —',
      'Totally agree.',
      'I had a similar issue.',
      'Quick note:',
      'Thanks for sharing —',
      'Minor correction:',
      'Can confirm this works on my machine.',
    ];

    const makeTitle = (topicSlug, idx) => {
      const tmpl = rand(titleTemplates);
      return tmpl(topicSlug, idx);
    };

    const makePostContent = (topicSlug) => {
      // Build 3-6 sentences, sometimes include a question or code-like snippet
      const sentences = [];
      const count = 3 + Math.floor(Math.random() * 4); // 3-6 sentences
      for (let s = 0; s < count; s++) {
        let sentence = rand(sentenceFragments);
        // occasionally inject topic or small code snippet
  if (Math.random() < 0.25) sentence += ' Example: try using `' + topicSlug + '`';
        if (Math.random() < 0.15) sentence += ' Any thoughts?';
        sentences.push(sentence);
      }
      return sentences.join(' ');
    };

    const makeComment = (topicSlug, idx) => {
      const start = rand(commentStarts);
      const body = sample(1 + Math.floor(Math.random() * 3), sentenceFragments);
      return `${start} ${body}`;
    };

    for (const topic of topics) {
      for (let i = 0; i < POSTS_PER_TOPIC; i++) {
        const title = makeTitle(topic.slug, i);
        const content = makePostContent(topic.slug);

        const post = await prisma.post.create({
          data: {
            title,
            content,
            userId: user.id,
            topicId: topic.id,
          },
        });

        // Create top-level comments for the post
        for (let c = 0; c < COMMENTS_PER_POST; c++) {
          const commentText = makeComment(topic.slug, c);
          const comment = await prisma.comment.create({
            data: {
              content: commentText,
              postId: post.id,
              userId: user.id,
            },
          });

          // create nested replies recursively
          if (REPLIES_PER_COMMENT > 0 && MAX_REPLY_DEPTH > 0) {
            await createRepliesRecursively(post.id, comment.id, MAX_REPLY_DEPTH);
          }
        }
      }
    }

    console.log(`Seeding completed for user ${user.email}`);
  }

  // Run seeding in parallel for all provided emails
  await Promise.all(seedEmails.map((e) => seedForUser(e)));

  console.log('All seeding tasks completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
