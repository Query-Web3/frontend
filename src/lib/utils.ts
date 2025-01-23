import type { SelectOptionType } from "flowbite-svelte";

export const select_option = <T>(options: T[]) => options.map((chain): SelectOptionType<T> => ({ value: chain, name: String(chain) }));