import Script from 'next/script'

export default function PlayerExample() {
    return (
        <>
            <div>
                <div id="garseja-audio-player"
                    data-header-text-selector=".article-title h1"
                    data-content-text-selector=".article-text p"
                    data-content-text-excluded-tags="strong"
                    data-voice="benas"
                    data-feedback-href="/"
                    data-feedback-title="Palikti atsiliepimą"
                >
                </div>
            </div >
            <Script
                id="audio-player-script"
                type="text/javascript"
                crossOrigin="anonymous"
                strategy="lazyOnload"
                src="/audio-player/v3/audio-player-3.0.js">
            </Script>
        </>
    )

}