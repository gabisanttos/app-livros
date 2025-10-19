export function capitalizeName(name?: string): string {
    if (!name) return 'Usuário';
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}