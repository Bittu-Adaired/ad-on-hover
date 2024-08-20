'use server'

import audioTrackFromURLResolverServiceExecutor, { AudioTrackFromUrlkResolverServiceResponse } from "@/domain/services/audio/audio-track-from-url-resolver-service"
import React from "react"
import { AdType } from "./_components/ad-type"
import ErrorMessageComponent from "./_components/error-message-component"
import AdsOnPlayerHoverAudioPlayer from "./_components/player-by-ad-type/hover-player/ads-on-player-hover-audio-player"
import { PlayerParams } from "./_components/player-by-ad-type/player-params"

export default async function AudioPlayerWithAdsPage(
    { searchParams,
        params
    }: {
        params: {
            userUUID: string
        }
        searchParams: {
            pageURL: string,
            themeId: string,
            voice: string,
            adType: string,
            videoAdUrl: string,
        }
    }) {
    const userUUID = params.userUUID
    const pageURL = searchParams.pageURL
    const themeId = searchParams.themeId
    const voice = searchParams.voice
    const adType = searchParams.adType ? AdType[searchParams.adType as keyof typeof AdType] : undefined
    const videoAdUrl = searchParams.videoAdUrl

    if (!adType) {
        return (
            <ErrorMessageComponent message={`Atsiprašome, nenurodytas 'adType' parametas.`} />
        )
    }

    if (!themeId) {
        return (
            <ErrorMessageComponent message={`Atsiprašome, nenurodytas 'themeId' parametas.`} />
        )
    }

    if (!videoAdUrl) {
        return (
            <ErrorMessageComponent message={`Atsiprašome, nenurodytas 'videoAdUrl' parametas.`} />
        )
    }

    if (!pageURL) {
        return (
            <ErrorMessageComponent message={`Atsiprašome, nenurodytas 'pageURL' parametras.`} />
        )
    }

    const audioPlayerComponent = resolveThemeByIdAndAdType(themeId, adType)
    if (!audioPlayerComponent) {
        return (
            <ErrorMessageComponent message={`Atsiprašome, nurodytas 'themeId' = ${themeId} ir 'adType' = ${adType} parametrai yra neteisingi.`} />
        )
    }

    try {
        const audioFileInfo: AudioTrackFromUrlkResolverServiceResponse = await audioTrackFromURLResolverServiceExecutor({ userUUID, pageURL, voice })
        const playerParams: PlayerParams = {
            url: audioFileInfo.url,
            themeId,
            recordId: audioFileInfo.id,
            pageURL,
            videoAdUrl
        }
        
        return React.createElement(audioPlayerComponent, playerParams)
    } catch (error: any) {
        console.error(`Failed synthesis loading`, error)
        return (
            <ErrorMessageComponent message={'Atsiprašome, šiuo metu teksto įgarsinimas negalimas.'} />
        )
    }
}

function resolveThemeByIdAndAdType(themeId: string, adType: AdType): ((playerParams: PlayerParams) => JSX.Element) | undefined {
    switch (adType) {
        case AdType.HOVER_PLAYER:
            switch (themeId) {
                case 'default':
                    return AdsOnPlayerHoverAudioPlayer
            }
        default:
            return undefined
    }
}