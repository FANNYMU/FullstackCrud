// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client'; // Import the PrismaClient from the '@prisma/client' package
import type { NextApiRequest, NextApiResponse } from 'next'; // Import the necessary types from the 'next' package

const prisma = new PrismaClient(); // Create a new instance of the PrismaClient

type Data = {
  id?: number | string;
  username?: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  message?: string | number | string[];
  statusCode?: number;
  data?: object | string | number | string[] | undefined;
};

const getUsers = async (): Promise<Data> => {
  const users = await prisma.user.findMany(); // Retrieve all users from the database using the PrismaClient
  return { statusCode: 200, data: users }; // Return the users as the data with a status code of 200
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    // Check if the request method is not GET
    return res.status(405).json({ message: 'Method not allowed' }); // Return a 405 response with an error message
  }

  try {
    const data = await getUsers(); // Call the getUsers function to retrieve the users
    res.status(data.statusCode || 200).json(data); // Return the retrieved data with the corresponding status code
  } catch (error) {
    console.error(error); // Log any errors that occur during the execution
    res.status(500).json({ message: 'Internal server error' }); // Return a 500 response with an error message
  }
}
