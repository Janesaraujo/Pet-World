import * as httpDriver from "./drivers/http-driver.js";
import * as localDriver from "./drivers/local-driver.js";

/**
 * __API_MODE__ is replaced with a string literal at build time (DefinePlugin).
 * In production the value becomes "local", so webpack can drop the unused
 * driver when generating the bundle.
 */
export const apiMode = __API_MODE__;

export const driver = apiMode === "local" ? localDriver : httpDriver;
