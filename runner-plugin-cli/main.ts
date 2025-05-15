import { register as registerFileSystemSteps } from "./cucumber/step_definitions/file_system";
// import { register as registerPackagesSteps } from "./cucumber/step_definitions/packages";
// import { register as registerShellSteps } from "./cucumber/step_definitions/shell";
import { register as registerParamTypes } from "./cucumber/support/param_types";

export function register(cucumber: any): void {
    console.log("registering cli support code");
    registerFileSystemSteps(cucumber);
    // registerPackagesSteps(cucumber);
    // registerShellSteps(cucumber);
    registerParamTypes(cucumber);
}
