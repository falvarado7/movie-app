import { FaStar } from 'react-icons/fa';

export default function RatingStars({ value = 0, outOf = 5, className = '' }) {
    const full = Math.round(value);
    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {Array.from({ length: outOf }).map((_, i) => (
                <FaStar
                    key={i}
                    className={i < full ? 'text-yellow-500' : 'text-zinc-300 dark:text-zinc-700'}
                    size={14}
                    aria-hidden="true"
                />
            ))}
            <span className="ml-1 text-xs text-zinc-500">{value?.toFixed?.(1) ?? value}</span>
        </div>
    );
}