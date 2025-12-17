"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setError("");
      await axios.post("/login", { email, password });
    } catch (err: any) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldGroup>
          <Field className="flex flex-col">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FieldDescription>
              Choose a unique email for your account.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          {error && <p>{error}</p>}

          <Button onClick={handleSubmit}>Login</Button>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}

export default LoginForm;
