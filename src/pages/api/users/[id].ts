import type { NextApiRequest, NextApiResponse } from 'next'; // Import the necessary types from the 'next' package
import { PrismaClient } from '@prisma/client'; // Import the PrismaClient from the '@prisma/client' package

const prisma = new PrismaClient(); // Create a new instance of the PrismaClient

type ApiResponse = {
  message: string;
  statusCode?: number;
  data?: object;
  error?: string;
};

// Function to delete a user
const deleteUser = async (id: number) => {
  return prisma.user.delete({
    where: { id },
  });
};

// Function to update a user
const updateUser = async (
  id: number,
  data: { username?: string; email?: string; password?: string }
) => {
  return prisma.user.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { id } = req.query; // Extract the 'id' from the request query

  // Validate the ID
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: 'Invalid or missing user ID' });
  }

  try {
    if (req.method === 'DELETE') {
      const user = await deleteUser(Number(id)); // Call the 'deleteUser' function to delete the user
      return res
        .status(200)
        .json({ statusCode: 200, message: 'User deleted', data: user });
    }

    if (req.method === 'PUT') {
      const data = req.body; // Extract the request body
      const user = await updateUser(Number(id), data); // Call the 'updateUser' function to update the user
      return res
        .status(200)
        .json({ statusCode: 200, message: 'User updated', data: user });
    }

    // If the method is not supported
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: (error as Error).message,
    });
  }
}
