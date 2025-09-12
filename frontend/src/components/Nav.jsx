
import { Film, Search } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import { Link } from 'react-router-dom';

export default function Nav() {
  const linkCls = ({ isActive }) =>
    `text-sm px-2 py-1 rounded ${isActive ? 'text-brand-600' : 'text-zinc-700 dark:text-zinc-200'} hover:underline`;

  return (
        <header className="
                sticky top-0 z-30 border-b border-zinc-400/70
                dark:border-zinc-800 bg-zinc-200/60
                dark:bg-zinc-900/60 backdrop-blur"
        >
            <nav className="container flex h-16 items-center justify-between gap-3">
                <Link to="/" className="inline-flex items-center gap-2">
                    <div className="grid place-items-center h-9 w-9 rounded-xl bg-brand-600 text-white">
                        <Film size={18}/>
                    </div>
                    <span className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                        We Love Movies
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-4 text-zinc-900 dark:text-zinc-100">
                    <Link to="/movies" className={linkCls}>Movies</Link>
                    <Link to="/theaters" className={linkCls}>Theaters</Link>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16}/>
                        <input
                            placeholder="Search movies…"
                            className="
                                ring-focus w-72 rounded-xl border border-zinc-500
                                dark:border-zinc-800 bg-transparent pl-9 pr-3 py-2
                                text-sm text-zinc-900 dark:text-zinc-100
                                placeholder:text-zinc-500"
                        />
                    </div>
                    <DarkModeToggle />
                </div>
            </nav>
        </header>
  );
}