import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function POST(request: Request) {
  const body = await request.json();
  
  if(!body.name || !body.email || !body.password) return new Response('Missing name, email or password', {status: 400});

  const userExists = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  })

  if (userExists) return new Response('User already exists', {status: 400});


  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      hashedPassword: bcrypt.hashSync(body.password, 10),
    }
  })
  
  console.log('Usuário criado com sucesso');
  return new Response(JSON.stringify(user));

}