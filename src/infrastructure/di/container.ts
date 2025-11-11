import { createContainer, asValue } from "awilix";
// import { logger } from "../logger/index.js";
import { config } from '../../config.js';


const container = createContainer();

container.register({
  config: asValue(config),
  // logger: asClass(logger).singleton(),
});
