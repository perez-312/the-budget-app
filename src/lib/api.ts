const isDev = import.meta.env.DEV;

export const API_URL = import.meta.env.VITE_API_URL || "https://93eogce5if.execute-api.us-east-1.amazonaws.com/dev";

console.log("Using API_URL:", API_URL);

export const fetchBudgets = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

export const createBudget = async (title: string, amount: number) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, amount }),
  });
  return await res.json();
};

console.log("Using API_URL:", API_URL);

fetchBudgets().then(data => {
  console.log("Fetched budgets from API:", data);
}).catch(err => {
  console.error("Error fetching budgets:", err);
});