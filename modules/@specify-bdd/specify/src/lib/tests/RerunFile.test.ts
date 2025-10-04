import fs            from "fs/promises";
import { RerunFile } from "../RerunFile";

vi.mock("fs/promises");

describe("RerunFile", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe("read()", () => {
        it("reads a file from path", async () => {
            await RerunFile.read("/foo/bar");

            expect(fs.readFile).toBeCalledWith("/foo/bar", { "encoding": "utf8" });
        });

        it("returns an array of paths when reading a rerun file", async () => {
            vi.mocked(fs).readFile.mockResolvedValueOnce("featureA:1\nfeatureB:2:3\nfeatureC:4");

            expect(await RerunFile.read("/test")).toEqual([
                "featureA:1",
                "featureB:2:3",
                "featureC:4",
            ]);
        });

        it("returns an empty array when reading an empty file", async () => {
            vi.mocked(fs).readFile.mockResolvedValueOnce("");

            expect(await RerunFile.read("/test")).toEqual([]);
        });

        it("throws an error if nothing exists at filepath", async () => {
            vi.mocked(fs).readFile.mockImplementationOnce(async () => {
                throw Error("ENOENT: no such file or directory, open '/doesnt-exist'");
            });

            await expect(RerunFile.read("/doesnt-exist")).rejects.toThrow(
                Error("No rerun file found at path: /doesnt-exist"),
            );
        });
    });

    describe("makeAbsolute()", () => {
        it("converts a rerun file's filepaths from relative to absolute", async () => {
            vi.mocked(fs).readFile.mockResolvedValueOnce("test-feature:1");

            await RerunFile.makeAbsolute("/test", "/foo/bar/baz");

            expect(fs.readFile).toBeCalledWith("/test", { "encoding": "utf8" });
            expect(fs.writeFile).toBeCalledWith("/test", "/foo/bar/baz/test-feature:1", {
                "encoding": "utf8",
            });
        });
    });
});
