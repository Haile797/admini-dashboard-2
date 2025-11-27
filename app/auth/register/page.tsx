"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 rounded" />
        <input name="email" placeholder="Email" onChange={handleChange} className="border p-2 rounded" />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} className="border p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">Register</button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
}
