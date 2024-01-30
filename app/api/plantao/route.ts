
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next"
import { options } from "../auth/[...nextauth]/options";
const prisma = new PrismaClient();

export async function GET(request: Request, response: Response) {
  const session = await getServerSession(options);
  console.log("sessaoAPI:", session);

    if (!session) {
      // Handle the case when session is null
      return new Response(JSON.stringify('Session not found'));
    }

    try {
      const users = await prisma.user.findUnique({
        where: {
          id: session.user.id
        }
      }); // Retrieve all users from the User model
      return new Response(JSON.stringify(users));
    } catch (error) {
      return new Response(JSON.stringify('users not found'));
    }

}

export async function POST(request: Request, response: Response) {
  const session = await getServerSession(options);
  const res = await request.json();

  if (!session) {
    // Handle the case when session is null
    return new Response(JSON.stringify('Session not found'));
  }
  
  const plantao = await prisma.plantao.create({
    data: {
      userId: session.user.id,
      data: new Date(res.dataPlantao).toISOString(), // Convert to ISO-8601 format
      turno: 'manha'
    },
  });

  return Response.json(res);
}
