"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function TestTokenPage() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = async () => {
    setLoading(true);

    try {
      const result = await authClient.token();

      if (result.error) {
        alert(result.error.message);
        return;
      }

      setToken(result.data?.token || "");
    } catch (error) {
      console.error(error);
      alert("Failed to get JWT token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5 p-6">
      <h1 className="text-2xl font-bold">JWT Token Test</h1>

      <button
        onClick={getToken}
        disabled={loading}
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        {loading ? "Loading..." : "Get JWT Token"}
      </button>

      {token && (
        <div className="w-full max-w-2xl break-all rounded-lg border p-4">
          <p className="mb-2 font-semibold">Your JWT Token:</p>
          {token}
        </div>
      )}
    </div>
  );
}
