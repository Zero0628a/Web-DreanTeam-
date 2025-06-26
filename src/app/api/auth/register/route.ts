import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  if (!email || !password) {
    return new Response("Faltan campos", { status: 400 });
  }

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return new Response("Usuario ya existe", { status: 400 });
  }


  await prisma.user.create({
    data: {
      email,
      name,
      password
    },
  });

  return new Response("Usuario registrado con éxito", { status: 200 });
}
