
import AudioPlayerScriptComponent from "./audio-player-script-component"

export default function PlayerExampleSectionComponent({ children }: { children: any }) {
    return (
        <>
            <h2 className="text-2xl my-10 font-bold text-center">Example:</h2>
            {children}
            <AudioPlayerScriptComponent />
        </> 
    )
}