# 🌐 Web-DreanTeam

Este es el repositorio del proyecto **Web-DreanTeam**. A continuación encontrarás los pasos para instalar y ejecutar la aplicación localmente.

---

## 📦 Requisitos previos

Antes de continuar, asegúrate de tener instalado lo siguiente:

- Git → https://git-scm.com/downloads  
- Node.js (incluye npm) → https://nodejs.org/  
  > Se recomienda Node.js v18 o superior

---

## 🚀 Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/Zero0628a/Web-DreanTeam-.git
cd Web-DreanTeam-

# Instalar dependencias
npm install

# Generar el cliente de Prisma
npx prisma generate

# Construir el proyecto
npm run build

# Iniciar el servidor
npm run start
