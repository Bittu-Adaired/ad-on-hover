export default function ErrorMessageComponent({ message }: { message: string }) {
    return (
        <div className="text-center text-red-500 mx-auto">
            <p className="m-5">{message}</p>
        </div>
    )
}