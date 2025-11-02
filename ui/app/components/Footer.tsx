import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
        <p>© {new Date().getFullYear()} HederaHub. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-navy">Privacy</Link>
          <Link href="#" className="hover:text-navy">Terms</Link>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-navy">GitHub</a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-navy">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
