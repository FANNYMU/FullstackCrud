import React, { useState } from 'react'; // Import the necessary modules from the 'react' package

export interface User {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CreateUsers = () => {
  const [username, setUsername] = useState(''); // Define a state variable 'username' and a function 'setUsername' to update its value. Initialize it with an empty string.
  const [email, setEmail] = useState(''); // Define a state variable 'email' and a function 'setEmail' to update its value. Initialize it with an empty string.
  const [password, setPassword] = useState(''); // Define a state variable 'password' and a function 'setPassword' to update its value. Initialize it with an empty string.
  const [message, setMessage] = useState(''); // Define a state variable 'message' and a function 'setMessage' to update its value. Initialize it with an empty string.

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Define an asynchronous function 'handleSubmit' that takes an event of type 'React.FormEvent<HTMLFormElement>' as a parameter
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      const response = await fetch('/api/users', {
        // Send a POST request to the '/api/users' endpoint
        method: 'POST', // Set the request method to 'POST'
        headers: {
          'Content-Type': 'application/json', // Set the 'Content-Type' header to 'application/json'
        },
        body: JSON.stringify({ username, email, password }), // Convert the form data to JSON and set it as the request body
      });

      const { message: responseMessage } = await response.json(); // Parse the response JSON and extract the 'message' property
      setMessage(responseMessage); // Update the 'message' state with the extracted message
    } catch (error) {
      console.error(error); // Log any errors that occur during the request
    }
  };

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <title>User Management</title>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        {message && (
          <p
            className={
              message !== 'User successfully created'
                ? 'text-red-500'
                : 'text-green-600'
            }
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="mb-4">
          <Input
            type="text"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Add User</Button>
        </form>
      </div>
    </main>
  );
};

const Input = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <label className="block mb-2">
    <span className="text-gray-700">{label}</span>
    <input className="border rounded-lg p-2 w-full" {...props} />
  </label>
);

const Button = ({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="bg-blue-500 text-white rounded-lg p-2 w-full hover:bg-blue-600"
    {...props}
  >
    {children}
  </button>
);

export default CreateUsers;
