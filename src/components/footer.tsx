import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-0 border-t border-slate-200">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-start justify-between py-6 gap-4">
          <div className="md:flex-1">
            <Link href="/" className="font-bold text-base">
              Discuss
            </Link>
            <p className="text-sm text-slate-600 mt-2 max-w-sm">
              A small discussion app built with Next.js. Share knowledge, ask questions, and learn from the community.
            </p>
          </div>

          <nav className="md:flex-1 flex flex-row gap-8 justify-center">
            <div className="flex flex-col">
              <span className="font-medium text-sm">Product</span>
              <Link href="/" className="text-sm text-slate-600 hover:underline mt-2">Home</Link>
              <Link href="/topics" className="text-sm text-slate-600 hover:underline mt-1">Topics</Link>
            </div>

            <div className="flex flex-col">
              <span className="font-medium text-sm">Company</span>
              <Link href="/about" className="text-sm text-slate-600 hover:underline mt-2">About</Link>
              <Link href="/contact" className="text-sm text-slate-600 hover:underline mt-1">Contact</Link>
            </div>
          </nav>

          <div className="md:flex-1 text-center md:text-right">
            <p className="text-sm text-slate-600">&copy; {year} Discuss. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
