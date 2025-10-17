export interface SystemIOSession {
    killCommand(signal?: string): void;
    killSession(signal?: string): void;
    onClose(callback: () => void): void;
    onError(callback: (data: string) => void): void;
    onOutput(callback: (data: string) => void): void;
    write(command: string): void;
}
