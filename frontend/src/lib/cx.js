export default function cx(...parts) {
    return parts.filter(Boolean).join(' ');
}