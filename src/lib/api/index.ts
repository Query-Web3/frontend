import createClient from "openapi-fetch";
import type { paths as ApiPaths, components } from "./api";
import { PUBLIC_BASE_URL } from "$env/static/public";

export type { ApiPaths };

export type ApiSchema = components['schemas'];

console.log(PUBLIC_BASE_URL)
export const clientApi = createClient<ApiPaths>({ baseUrl: PUBLIC_BASE_URL });