
import { Film, Search, X } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import { NavLink, useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

export default function Nav() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const { pathname } = useLocation();
    const inputRef = useRef(null);

    const qParam = params.get('q') ?? '';
    const [q, setQ] = useState(qParam);

    // Keep field in sync when URL changes (e.g., back/forward)
    useEffect(() => { setQ(qParam); }, [qParam]);

    useEffect(() => {
        const onKey = (e) => {
        if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
            e.preventDefault();
            inputRef.current?.focus();
        }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        const term = q.trim();
        if (term) navigate(`/?q=${encodeURIComponent(term)}`);
        else navigate('/');
    };

    const clear = () => {
        setQ('');
        navigate('/');
        inputRef.current?.focus();
    };

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
                    <span className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                        We Love Movies
                    </span>
                </Link>

                <div className="flex items-center gap-4 text-zinc-900 dark:text-zinc-100">
                    <NavLink to="/movies" className={linkCls}>Movies</NavLink>
                    <NavLink to="/theaters" className={linkCls}>Theaters</NavLink>

                    <form onSubmit={onSubmit} className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16}/>
                        <input
                            ref={inputRef}
                            value={q}
                            onChange={(e) => {
                                const val = e.target.value;
                                setQ(val);
                                const url = val.trim()
                                    ? `/?q=${encodeURIComponent(val.trim())}`
                                    : '/';
                                navigate(url, { replace: pathname.startsWith('/') });
                            }}
                            placeholder="Search movies…"
                            className="
                                ring-focus w-72 rounded-xl border border-zinc-500
                                dark:border-zinc-800 bg-transparent pl-9 pr-3 py-2
                                text-sm text-zinc-900 dark:text-zinc-100
                                placeholder:text-zinc-500"
                        />
                        {q && (
                            <button
                                type="button"
                                onClick={clear}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                aria-label="Clear search"
                            >
                                <X size={14}/>
                            </button>
                        )}
                    </form>
                    <DarkModeToggle />
                </div>
            </nav>
        </header>
    );
}