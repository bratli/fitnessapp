import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { loginInputSchema } from "@/lib/schemas";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = loginInputSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues }, { status: 400 });
  }

  const { username, password } = result.data;

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return NextResponse.json(
      { error: "Ugyldig brukernavn eller passord" },
      { status: 401 },
    );
  }

  const valid = await compare(password, user.passwordHash);

  if (!valid) {
    return NextResponse.json(
      { error: "Ugyldig brukernavn eller passord" },
      { status: 401 },
    );
  }

  await createSession({ userId: user.id, username: user.username });

  return NextResponse.json({
    id: user.id,
    username: user.username,
    name: user.name,
  });
}
