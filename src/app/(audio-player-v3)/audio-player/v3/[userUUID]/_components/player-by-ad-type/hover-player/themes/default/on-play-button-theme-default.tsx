import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { OnPlayerHoverThemeParams } from './on-player-hover-theme-params'

export default function AudioPlayerOnHoverThemeDefault(params: OnPlayerHoverThemeParams) {
    return (
        <div className="w-full mx-auto">
            <PlayerContent {...params} />
        </div>
    )
}

function PlayerContent({ url, audioRef, togglePlay, handleSeek, handleSpeedChange, formatTime, playbackSpeed, currentTime, duration, isPlaying }: OnPlayerHoverThemeParams) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className='w-full'>
                <audio className='hidden' itemType="audio/mp3" ref={audioRef} src={url} />
                <div className='flex justify-between items-center'>

                    <div className='grid grid-rows-3 w-full mx-2'>
                        <div className='grid grid-cols-1 min-[350px]:grid-cols-2 items-center'>
                            <div className='text-2xl sm:text-md font-semibold'>
                                Klausykite įrašo
                            </div>
                            <div className='text-end hidden min-[350px]:block'>
                                <select id="speed" value={playbackSpeed} onChange={handleSpeedChange} className="select select-xs select-bordered rounded-full text-center">
                                    <option value={0.5}>0.5x</option>
                                    <option value={0.75}>0.75x</option>
                                    <option value={1}>1x</option>
                                    <option value={1.25}>1.25x</option>
                                    <option value={1.5}>1.5x</option>
                                    <option value={2}>2x</option>
                                </select>
                            </div>
                        </div>


                        <div className="flex my-auto text-gray-500 w-full text-xs items-center mr-2">
                            <div className='mx-2'>
                                <PlayButton togglePlay={togglePlay} isPlaying={isPlaying} />
                            </div>
                            <div className="mr-2 col-start-auto">
                                <span>{formatTime(currentTime)}</span>
                            </div>

                            <div className="flex-auto h-auto my-auto items-center">
                                <input
                                    type="range"
                                    min={0}
                                    max={Math.floor(duration)}
                                    step={1}
                                    value={Math.floor(currentTime)}
                                    onChange={handleSeek}
                                    className="w-full"
                                />
                            </div>
                            <div className="ml-2">
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        <div className="flex justify-end items-center text-gray-500 text-xs">
                            <span>Sukurta&nbsp;</span>
                            <Link href='https://test.com' target='_blank' className='hover:underline hover:text-gray-900'>
                                <span className='font-semibold'>test.com</span>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

function PlayButton({ togglePlay, isPlaying }: { togglePlay: () => void, isPlaying: boolean }) {
    const playButtonClassName = ` w-20 h-20 stroke-1`
    return (
        <button
            onClick={togglePlay}
            className={`text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-600 rounded-full stroke-none `}
        >
            {isPlaying ? <PauseCircleIcon className={playButtonClassName} /> : <PlayCircleIcon className={playButtonClassName} />}
        </button>
    )
}
