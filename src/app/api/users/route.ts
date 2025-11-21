// src/app/api/users/route.ts
import { createUserAction } from "@/features/users/presentation/actions/create-user-action";

// This file now just satisfies the Next.js routing rule.
// All the logic is correctly located inside the feature slice.
export const POST = createUserAction;
