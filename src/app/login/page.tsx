"use client";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      window.location.href = "/";
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico para iniciar sesión en tu cuenta de
            InteracQuiz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-1 right-1 h-7 w-7"
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">
                  Alternar visibilidad de contraseña
                </span>
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700"
            >
              Iniciar Sesión
            </Button>

            <div className="mt-4 text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="underline">
                Regístrate
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
