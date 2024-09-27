type User = {
  name: string;
  email: string;
  password: string;
  repassword: string;
};

export async function register({ ...data }: User) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  return response.json();
}

export async function login({
  email,
  password,
}: Omit<User, "name" | "repassword">) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  return response.json();
}
