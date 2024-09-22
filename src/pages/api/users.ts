import type { NextApiRequest, NextApiResponse } from 'next'; // Import the necessary types from the 'next' package
import bcrypt from 'bcrypt'; // Import the 'bcrypt' package for password hashing
import { PrismaClient } from '@prisma/client'; // Import the PrismaClient from the '@prisma/client' package

type ApiResponse = {
  message: string;
  statusCode: number;
  data?: object;
};

const prisma = new PrismaClient(); // Create a new instance of the PrismaClient

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) => {
  if (req.method !== 'POST') {
    // Check if the request method is not POST
    return res
      .status(405)
      .json({ statusCode: 405, message: 'Method not allowed' }); // Return a 405 response with an error message
  }

  const { username, email, password } = req.body; // Extract the username, email, and password from the request body

  // Validate input
  const validationError = validateInput(username, email, password); // Call the validateInput function to validate the input
  if (validationError) {
    return res.status(400).json({ statusCode: 400, message: validationError }); // Return a 400 response with the validation error message
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } }); // Check if there is an existing user with the same email
  if (existingUser) {
    return res
      .status(400)
      .json({ statusCode: 400, message: 'Email already exists' }); // Return a 400 response with an error message if the email already exists
  }

  // Create a new user with hashed password
  const newUser = await createUser(username, email, password); // Call the createUser function to create a new user with a hashed password
  return res.status(201).json({
    statusCode: 201,
    message: 'User successfully created',
    data: newUser,
  }); // Return a 201 response with a success message and the newly created user
};

// Function to validate input
const validateInput = (
  username: string,
  email: string,
  password: string
): string | null => {
  if (!username || !email || !password) {
    return 'Missing required fields'; // Return an error message if any of the required fields are missing
  }
  return null; // Return null if the input is valid
};

// Function to create a new user with hashed password
const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt
  return prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  }); // Create a new user in the database with the hashed password
};

export default handler; // Export the handler function as the default export
