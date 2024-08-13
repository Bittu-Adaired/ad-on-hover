
export type Theme = {
    id: string,
}

const themes: Theme[] = [
    { id: 'default' },
]

export default themes

export function findThemeById(id: string): Theme | undefined {
    if (!id) {
        return undefined
    }
    const foundValue = themes.find(theme => theme.id === id)
    if (foundValue) {
        return foundValue
    } else {
        return undefined
    }
}