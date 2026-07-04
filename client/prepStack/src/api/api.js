const API_URL = import.meta.env.VITE_API_URL;

export const fetchWithAuth = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// export const fetchWithAuth = async (endpoint, options = {}) => {
//   const res = await fetch(`${API_URL}${endpoint}`, {
//     ...options,
//     credentials: "include", // THIS IS THE MAGIC LINE! It tells the browser to send the HTTP-Only cookie.
//     headers: {
//       "Content-Type": "application/json",
//       ...options.headers, // if user wants they can share additional headers
//     },
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "Something went wrong");
//   }

//   return data;
// };
