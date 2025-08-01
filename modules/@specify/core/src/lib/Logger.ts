import { mkdir, readFile, unlink } from "node:fs/promises";
import { tmpdir                  } from "node:os";
import { join                    } from "node:path";
import { JsonObject              } from "type-fest";

type Deleter = (path: string) => Promise<void>;
type DirMaker = (path: string) => Promise<string>;
type Reader = (path: string) => Promise<string>;

interface LoggerOptions {
    deleter?: Deleter;
    dirMaker?: DirMaker;
    reader?: Reader;
}

export class Logger {
    #deleter: Deleter;
    #dirMaker: DirMaker;
    #reader: Reader;

    constructor({ deleter, dirMaker, reader }: LoggerOptions = {}) {
        this.#deleter = deleter ?? unlink;
        this.#dirMaker = dirMaker ?? ((path) => mkdir(path, { "recursive": true }));
        this.#reader = reader ?? ((path) => readFile(path, "utf-8"));
    }

    async consumeTmpLog(path: string): Promise<JsonObject> {
        const json = await this.readTmpLog(path);

        await this.#deleter(path);

        return json;
    }

    async readTmpLog(path: string): Promise<JsonObject> {
        return JSON.parse(await this.#reader(path));
    }

    async generateTmpLogPath(prefix: string = "cucumber-log"): Promise<string> {
        const filename = `${prefix}-${crypto.randomUUID()}.json`;
        const dirPath  = join(tmpdir(), "specify");

        await this.#dirMaker(dirPath);

        return join(dirPath, filename);
    }
}
