"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { BrainCircuit, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeTab: "home" | "create" | "solve" | "profile";
  setActiveTab: (tab: "home" | "create" | "solve" | "profile") => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleTabChange = (tab: "home" | "create" | "solve" | "profile") => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const renderTabButton = (
    tab: "home" | "create" | "solve" | "profile",
    label: string
  ) => (
    <button
      onClick={() => handleTabChange(tab)}
      className={`text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
        activeTab === tab ? "text-teal-600 dark:text-teal-400" : ""
      }`}
      aria-current={activeTab === tab ? "page" : undefined}
      aria-label={`Ir a ${label}`}
      type="button"
    >
      {label}
    </button>
  );

  const user = session?.user;

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md" role="banner">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div
            className="text-teal-600 dark:text-teal-400 mr-2"
            aria-hidden="true"
          >
            <BrainCircuit size={32} />
          </div>
          <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-300">
            InteracQuiz
          </h1>
        </div>

        <nav
          className="hidden md:flex space-x-6"
          role="navigation"
          aria-label="Navegación principal"
        >
          {renderTabButton("home", "Inicio")}
          {renderTabButton("create", "Crear Pregunta")}
          {renderTabButton("solve", "Resolver")}
          {renderTabButton("profile", "Mi Perfil")}
        </nav>

        <div className="flex items-center space-x-4">
          {status === "loading" ? null : !session ? (
            <Button
              onClick={() => signIn()}
              className="bg-teal-600 hover:bg-teal-700"
              type="button"
            >
              Iniciar Sesión
            </Button>
          ) : (
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center text-teal-700 font-bold select-none"
                title={user?.name ?? ""}
                aria-label={`Usuario ${user?.name ?? "desconocido"}`}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
              </div>
              <button
                onClick={() => signOut()}
                className="ml-2 text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200"
                type="button"
                aria-label="Cerrar sesión"
              >
                Salir
              </button>
            </div>
          )}

          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            type="button"
          >
            <Menu />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden bg-white dark:bg-slate-800 py-4 px-4 shadow-lg"
          role="menu"
          aria-label="Menú móvil"
        >
          <div className="flex flex-col space-y-4">
            {renderTabButton("home", "Inicio")}
            {renderTabButton("create", "Crear Pregunta")}
            {renderTabButton("solve", "Resolver")}
            {renderTabButton("profile", "Mi Perfil")}
          </div>
        </div>
      )}
    </header>
  );
}
