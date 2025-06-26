"use client"

import { MainApp } from "@/components/main-app";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Espera a que cargue

    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  return (
    <div>
      <MainApp />
    </div>
  );
}
