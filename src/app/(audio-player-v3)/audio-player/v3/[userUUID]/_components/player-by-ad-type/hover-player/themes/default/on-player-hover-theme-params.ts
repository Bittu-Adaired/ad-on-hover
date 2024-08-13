
export type OnPlayerHoverThemeParams = {
    url: string
    audioRef: React.RefObject<HTMLAudioElement>
    togglePlay: () => void
    handleSeek: () => void
    handleSpeedChange: () => void
    formatTime: (time: number) => string
    playbackSpeed: number
    currentTime: number
    duration: number
    isPlaying: boolean,
}