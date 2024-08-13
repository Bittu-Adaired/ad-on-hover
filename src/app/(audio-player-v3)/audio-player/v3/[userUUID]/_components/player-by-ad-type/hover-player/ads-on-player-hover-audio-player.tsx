'use client'

import React, { useEffect, useRef, useState } from 'react'

import { PlayerParams } from '../player-params'
import { OnPlayerHoverThemeParams } from './themes/default/on-player-hover-theme-params'
import AudioPlayerOnHoverThemeDefault from './themes/default/on-play-button-theme-default'
import AdViewComponent from '../../ads/default/ad-view-component'
import { MESSAGE_TYPES } from './message-type'
import ExposableApplicationError from '@/common/exposable-application-error'

const AD_STATES = {
    NOT_PLAYED: 'NOT_PLAYED',
    PLAYING: 'PLAYING',
    PLAYED: 'PLAYED',
}

export default function AdsOnPlayerHoverAudioPlayer(
    { url, themeId, recordId, pageURL, videoAdUrl }: PlayerParams
) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [playbackSpeed, setPlaybackSpeed] = useState(1)
    const [adState, setAdState] = useState(AD_STATES.NOT_PLAYED)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        if (duration === 0) {
            setDuration(audioRef.current?.duration || 0)
        }

        const updateTime = () => {
            setCurrentTime(audio.currentTime)
            setDuration(audio.duration)
            if (audio.duration === audio.currentTime) {
                setIsPlaying(false)
            }
        }

        audio.addEventListener('timeupdate', updateTime)
        audio.addEventListener('durationchange', updateTime)

        return () => {
            audio.removeEventListener('timeupdate', updateTime)
            audio.removeEventListener('durationchange', updateTime)
        }
    }, [audioRef, duration, isPlaying])


    useEffect(() => {
        let activated = false
        window.addEventListener("message", function (message) {
            if (message.data.type !== MESSAGE_TYPES.V3.name) {
                return
            }
            if (message.data.action === MESSAGE_TYPES.V3.types.PLAYER_VISIBLE) {
                if (adState === AD_STATES.NOT_PLAYED && !activated) {
                    activated = true
                    setAdState(AD_STATES.PLAYING)
                }
            }
        })
    })

    const togglePlay = () => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
            console.log('playerButtonUsageServiceExecutor', {
                fileId: recordId,
            })
        }
        setIsPlaying(!isPlaying)
    }

    const handleAdClose = () => {
        setAdState(AD_STATES.PLAYED)
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value)
        if (!audioRef.current) return
        audioRef.current.currentTime = time

        setCurrentTime(time)
    }

    const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const speed = parseFloat(e.target.value)
        if (!audioRef.current) return
        audioRef.current.playbackRate = speed
        setPlaybackSpeed(speed)
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    if (adState === AD_STATES.PLAYING) {
        if (!videoAdUrl) {
            throw new ExposableApplicationError('Video ad url is not provided, but requireds')
        }
        return <AdViewComponent handleAdClose={handleAdClose} videoAdUrl={videoAdUrl} />
    }


    return resolveTheme(
        themeId,
        () => {
            if (adState === AD_STATES.NOT_PLAYED) {
                setAdState(AD_STATES.PLAYING)
            }
        },
        {
            url,
            audioRef,
            togglePlay,
            handleSeek,
            handleSpeedChange,
            formatTime,
            playbackSpeed,
            currentTime,
            duration,
            isPlaying
        } as OnPlayerHoverThemeParams
    )
}

function resolveTheme(themeId: string, onHover: () => void, params: OnPlayerHoverThemeParams) {
    switch (themeId) {
        case 'default':
            return <div>
                <AudioPlayerOnHoverThemeDefault {...params} />
            </div>
        default:
            throw new ExposableApplicationError(`Theme with id ${themeId} is not supported`)
    }
}
