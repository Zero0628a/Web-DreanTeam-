"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye } from "lucide-react";

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

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const error = await res.text();
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="mx-auto w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Registrarse</CardTitle>
          <CardDescription>
            Ingresa tus datos para crear una cuenta de InteracQuiz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                placeholder="Tu Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
              className="w-full bg-teal-600 hover:bg-teal-500"
            >
              Registrarse
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="underline">
              Iniciar Sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
