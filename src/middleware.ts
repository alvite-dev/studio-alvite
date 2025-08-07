import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rotas que não precisam de autenticação
  const publicPaths = ['/login'];
  const pathname = request.nextUrl.pathname;

  // Se for uma rota pública, permitir acesso
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Verificar se há token de autenticação no localStorage
  // Como middleware roda no servidor, vamos redirecionar para login
  // e deixar o cliente verificar a autenticação
  const response = NextResponse.next();
  
  // Adicionar header para verificação no cliente
  response.headers.set('x-pathname', pathname);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};