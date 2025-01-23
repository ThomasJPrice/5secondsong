"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";

const UsernameSelector = ({ onValidUsername }) => {
  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  // URL-friendly regex: allows letters, numbers, hyphens, and underscores
  const isValidUsername = (value) => /^[a-zA-Z0-9_-]+$/.test(value);

  // Check if the username is available in the database
  const checkUsername = async (value) => {
    setLoading(true);
    setIsAvailable(null);

    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("username", value)
      .maybeSingle();

    if (error) {
      setError("Error checking username.");
      console.log(error);
      
    } else {
      setIsAvailable(!data);
    }

    setLoading(false);
  };

  // Debounce function to avoid spamming the server with requests
  useEffect(() => {
    if (username.length >= 3 && isValidUsername(username)) {
      const debounce = setTimeout(() => {
        checkUsername(username);
      }, 500); // 500ms debounce

      return () => clearTimeout(debounce);
    }
  }, [username]);

  // Handle input changes
  const handleChange = (e) => {
    const value = e.target.value.trim().toLowerCase();

    if (value === "" || !isValidUsername(value)) {
      setError("Usernames can only contain letters, numbers, hyphens, and underscores.");
      setIsAvailable(null);
    } else {
      setError("");
      setUsername(value);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        id="username"
        value={username}
        onChange={handleChange}
        placeholder="Enter your username"
        className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-primary focus:outline-none"
      />
      {loading && <p className="text-sm text-gray-500">Checking availability...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {isAvailable === true && <p className="text-sm text-green-500">✅ Username is available!</p>}
      {isAvailable === false && <p className="text-sm text-red-500">❌ Username is already taken.</p>}

      <Button
        onClick={() => onValidUsername(username)}
        disabled={!isAvailable}
        className={`mt-4 px-4 py-2 rounded-md text-white ${
          isAvailable ? "bg-primary hover:bg-primary-dark" : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Continue
      </Button>
    </div>
  );
};

export default UsernameSelector;
