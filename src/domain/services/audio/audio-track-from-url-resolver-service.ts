
export type AudioTrackFromUrlkResolverServiceRequest = {
    userUUID: string
    pageURL: string
    voice: string
}

export type AudioTrackFromUrlkResolverServiceResponse = {
    id: string,
    url: string,
    downloadUrl: string
}

export default async function audioTrackFromURLResolverServiceExecutor(request: AudioTrackFromUrlkResolverServiceRequest): Promise<AudioTrackFromUrlkResolverServiceResponse> {

    return {
        url: '/audio-player/v3/sample.mp3',
        id: '1234567890',
        downloadUrl: '/audio-player/v3/sample.mp3'
    }

}