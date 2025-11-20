import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

// This function contains ALL the logic that was previously in route.ts
// It is now framework-independent in its LOCATION, but still uses framework
// types (Request/Response) because it IS the interface adapter.
export async function createUserAction(request: NextRequest) {
  try {
    const body = await request.json();

    // This would call your application layer (use case)
    // const user = await createUserUseCase(body);

    // Dummy success response for demonstration
    console.log("User created with data:", body);
    const user = { id: "123", ...body };

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation error", details: error.issues },
        { status: 400 }
      );
    }
    if (error.message === "Email already exists") {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
