import "./commands";
import { getBySelector, useIndexedDbService } from "./commands";

Cypress.Commands.add(getBySelector.name, getBySelector);
Cypress.Commands.add(useIndexedDbService.name, useIndexedDbService);
