export function Line({ w = 'w-full', h = 'h-3', className = '' }) {
    return <div className={`animate-pulse rounded ${w} ${h} bg-zinc-200/70 dark:bg-zinc-800/70 ${className}`} />;
}

export function Card({ className = '', children }) {
    return <div className={`card p-4 ${className}`}>{children ?? <Line h="h-20" />}</div>;
}