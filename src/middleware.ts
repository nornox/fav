import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.')
    const decodedPayload = JSON.parse(atob(payload))
    const expirationTime = decodedPayload.exp * 1000 // 转换为毫秒
    return Date.now() >= expirationTime
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true // 如果解析出错，认为token已过期
  }
}

export function middleware(request: NextRequest) {
  console.log('中间件开始执行')
  console.log('请求URL:', request.url)

  const token = request.cookies.get('token')?.value
  console.log('从cookie中获取的token:', token)

  const currentPath = request.nextUrl.pathname
  console.log('当前路径:', currentPath)

  // 定义不需要验证token的路由
  const publicRoutes = ['/login', '/register', '/api/auth/login', '/api/auth/register']

  // 如果是公开路由，直接放行
  if (publicRoutes.includes(currentPath)) {
    console.log('公开路由，无需验证token')
    return NextResponse.next()
  }

  // 检查token是否存在且未过期
  const isValidToken = token && !isTokenExpired(token)

  // 检查是否是API请求
  if (currentPath.startsWith('/api/')) {
    if (!isValidToken) {
      console.log('API请求的token无效或已过期，返回401错误')
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Authentication failed' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      )
    }
    return NextResponse.next()
  }

  // 处理受保护的路由
  if (!isValidToken) {
    console.log('未登录用户或token已过期，尝试访问受保护路由，重定向到登录页面')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  console.log('中间件执行完毕，允许请求继续')
  return NextResponse.next()
}

// 配置中间件应用的路由
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

console.log('中间件配置:', config)