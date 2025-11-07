export default function ContactPage() {
  return (
    <main className="py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Contact</h1>
        <p className="mb-6 text-slate-700">
          Have a question, feature request, or want to contribute? Fill out the
          form below and we&apos;ll get back to you.
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name</label>
            <input className="mt-1 w-full border rounded px-3 py-2" placeholder="Your name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input className="mt-1 w-full border rounded px-3 py-2" placeholder="your@email.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Message</label>
            <textarea className="mt-1 w-full border rounded px-3 py-2" rows={6} placeholder="How can we help?" />
          </div>

          <div>
            <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded">Send message</button>
          </div>
        </form>
      </div>
    </main>
  );
}
