import { waveform } from 'ldrs';

waveform.register();

export const Loader = ({ message }: { message: string }) => {
    return (
        <div className="flex flex-col h-screen justify-center items-center flex-grow space-y-8">
            <l-waveform
                size="48"
                stroke="4"
                speed="1"
                color="white"
            ></l-waveform>
            <p>{message}</p>
        </div>
    )
}