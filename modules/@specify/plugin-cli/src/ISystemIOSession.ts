export interface ISystemIOSession {
    kill(): void;
    onClose(callback: () => void): void;
    onError(callback: (data: string) => void): void;
    onOutput(callback: (data: string) => void): void;
    write(command: string): void;
}
