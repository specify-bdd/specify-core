import { FileParam       } from "@/types/params";
// import { defineParamType } from "@cucumber/cucumber";
import * as path           from "node:path";
import { lookup          } from "quick-ref";



// defineParamType({
//     "name": "ref:file",
//     "regexp": /[^"]*/i,
//     transformer(name: string): FileParam {
//         return lookup("file", name);
//     },
//     "type": "FileParam"
// });

// defineParamType({
//     "name": "path",
//     "regexp": /[^"]*/i,
//     transformer(name: string): string {
//         return path.resolve(name);
//     },
//     "type": "string"
// });



export function register(cucumber: any): void {
    console.log("registering param types");
    cucumber.defineParamType({
        "name": "ref:file",
        "regexp": /[^"]*/i,
        transformer(name: string): FileParam {
            return lookup("file", name);
        },
        "type": "FileParam"
    });

    cucumber.defineParamType({
        "name": "path",
        "regexp": /[^"]*/i,
        transformer(name: string): string {
            return path.resolve(name);
        },
        "type": "string"
    });
}
