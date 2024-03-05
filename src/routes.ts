import { Express } from "express";
import { getFilteredResponses } from "./controllers/formController";

export const routes = (app: Express) => {
  app.get("/:formId/filteredResponses", getFilteredResponses);
};
