
export default function PlayerMainPage() {
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-5">Players</h1>
            <div className="flex flex-col items-center justify-center text-xl space-y-2">
                <a className="link-hover" href="/ad-on-hover">Ad on hover</a>
                <a className="link-hover" href="/ad-on-hover-real">Ad on hover real</a>
            </div>
        </div>
    )
}