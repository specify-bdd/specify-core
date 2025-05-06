import { loadConfiguration, runCucumber } from '@cucumber/cucumber/api';
import { cucumber as config             } from "./config/all.ts";

// import step definition paths and add them to the cucumber config
// config.import.push(...step_def_paths);

// import gherkin feature paths and add them to the cucumber config
// config.paths.push(...gherkin_paths);

const { runConfiguration } = await loadConfiguration(config);
const res                  = await runCucumber(runConfiguration);

console.debug(res);
