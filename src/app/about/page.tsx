import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">About Discuss</h1>
        <p className="mb-4 text-slate-700">
          Discuss is a lightweight forum for developers to ask questions, share
          knowledge, and learn from each other. It&apos;s built with Next.js, NextAuth,
          and Prisma for a simple, modern developer experience.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Mission</h2>
        <p className="text-slate-700 mb-4">
          Our mission is to make it easy for developers to connect over problems
          they&apos;re solving and help one another grow.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Team</h2>
        <p className="text-slate-700 mb-4">
          This project is a small open-source demo maintained by contributors. If
          you&apos;d like to help, open a PR or reach out via the contact page.
        </p>

        <p className="mt-6">
          <Link href="/" className="text-blue-600 hover:underline">Return home</Link>
        </p>
      </div>
    </main>
  );
}
