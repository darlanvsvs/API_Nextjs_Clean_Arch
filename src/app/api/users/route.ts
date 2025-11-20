// src/app/api/users/route.ts
import { createUserAction } from "./create-user-action";

// This file now just satisfies the Next.js routing rule.
// All the logic is correctly located inside the feature slice.
export const POST = createUserAction;
