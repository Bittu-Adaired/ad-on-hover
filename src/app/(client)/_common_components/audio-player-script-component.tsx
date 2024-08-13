import Script from 'next/script'

export default function AudioPlayerScriptComponent() {
    return (
        <Script
            id="audio-player-script"
            type="text/javascript"
            crossOrigin="anonymous"
            strategy="lazyOnload"
            src="/audio-player/v3/audio-player-3.0.js">
        </Script>
    )
}