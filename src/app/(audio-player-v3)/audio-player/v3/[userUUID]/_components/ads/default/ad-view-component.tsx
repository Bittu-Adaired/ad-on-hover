'use client'

import { XMarkIcon } from "@heroicons/react/24/outline"

import { useEffect, useState } from "react"
import VideoGoogleImaV2 from "./video-google-ima-v2"

export default function AdViewComponent({ handleAdClose, videoAdUrl }: { handleAdClose: () => void, videoAdUrl: string }) {
    const [adIsLoading, setAdIsLoading] = useState(true)

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (adIsLoading) {
                handleAdClose()
            }
        }, 2000)

        return () => clearTimeout(timeout)
    }, [adIsLoading])

    return (
        <>
            <div className={`w-full mx-auto flex justify-center items-center  ${adIsLoading ? 'hidden' : ''}`}>
                <div className="flex flex-row">
                    <div className="">
                        <VideoGoogleImaV2 url={videoAdUrl} onFinishHandler={handleAdClose} setAdIsLoading={setAdIsLoading} />
                    </div>
                    <div className={`block z-50 text-right`}>
                        <CloseButton handleAdClose={handleAdClose} />
                    </div>
                </div>
            </div >
            {/* <div className={`w-full h-screen mx-auto flex justify-center items-center  ${adIsLoading ? '' : 'hidden'}`}>
                <div className="loading loading-spinner loading-lg"></div>
            </div> */}
        </>
    )
}

const CloseButton = ({ handleAdClose }: { handleAdClose: () => void }) => (
    <button className="btn btn-ghost btn-circle text-slate-500 bg-slate-50 bg-opacity-60 hover:bg-opacity-100 mx-2"
        onClick={handleAdClose}
        title="Uždaryti reklamą"
    >
        <XMarkIcon className="w-6 h-6" />
    </button>
)