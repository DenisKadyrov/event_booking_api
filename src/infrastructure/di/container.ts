import { createContainer, asValue, asFunction } from "awilix";
import { config } from '../../config.js';
import { createDatabase } from '../database/client.js';

const container = createContainer();

container.register({
  config: asValue(config),
  db: asFunction(createDatabase).singleton(),
});
