import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from "react-icons/fi";

export default function DarkModeToggle() {
    const [dark, setDark] = useState(() =>
        localStorage.getItem('theme') === 'dark' ||
        (localStorage.getItem('theme') == null && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );

    useEffect(() => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [dark]);

    return (
        <button
            className="
                ring-focus inline-flex items-center gap-2 rounded-xl border
                border-zinc-500 dark:border-zinc-800 px-3 py-2
                text-sm text-zinc-900 dark:text-zinc-100
                hover:bg-white dark:hover:bg-zinc-800/60"
            onClick={() => setDark(d => !d)}
            aria-label="Toggle dark mode"
        >
            {dark ? <FiSun size={16}/> : <FiMoon size={16}/>}
            <span className="hidden sm:inline">{dark ? 'Light' : 'Dark'}</span>
        </button>
    );
}