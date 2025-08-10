"use server";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./api/userAPI";
import { cookies } from "next/headers";

const protectedRoutes = [
  "/upload",
  "/profile",
  "/editprofile",
  "/me",
  "/album",
];
const publicRoutes = ["/", "/login", "/register"];

export const middleware = async (req: NextRequest) => {
  const currentPath = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(currentPath);
  const isPublicRoute = publicRoutes.includes(currentPath);

  // Si no es una ruta protegida, continuar
  if (!isProtectedRoute && !isPublicRoute) {
    return NextResponse.next();
  }

  const cookie = cookies().get("user")?.value;

  // Si no hay cookie en una ruta protegida, redirigir al login
  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (cookie) {
    // Si hay cookie, verificar sesión
    const session = await decrypt(cookie);

    if (!session) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("user");
      return response;
    }

    // Si la sesión es inválida, redirigir al login y eliminar cookie
    if (typeof session === "boolean" && session === false) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("user");
      return response;
    }

    // Si la sesión es válida y estamos en una ruta pública, redirigir al perfil
    if (session.username && isPublicRoute) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  // Permitir acceso
  return NextResponse.next();
};

// Rutas donde el middleware no debe ejecutarse
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
