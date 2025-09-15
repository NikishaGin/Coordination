import { Prisma } from "../../generated/prisma/client";

export type RegionsType = Prisma.RegionsGetPayload<{ omit: { sonoName: true } }>;
