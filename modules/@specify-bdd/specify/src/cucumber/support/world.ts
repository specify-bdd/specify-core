import { setWorld } from "@specify-bdd/specify";

import { SpecifyWorld } from "@/lib/SpecifyWorld";

export function register(): void {
    setWorld(SpecifyWorld);
}
