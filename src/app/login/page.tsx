'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Flex,
  VStack,
  Input,
  Button,
  Text,
  Heading,
  useToast,
  Image,
  Container,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useColorModeValue } from '@chakra-ui/react'
import { API_BASE_URL } from '@/config/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log('开始登录过程');
      console.log('请求URL:', `${API_BASE_URL}/auth/login`);
      console.log('请求体:', JSON.stringify({ email, password }));

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('响应状态:', response.status);
      console.log('响应头:', JSON.stringify(response.headers));

      if (!response.ok) {
        console.error('登录失败，HTTP状态码:', response.status);
        throw new Error('登录失败');
      }

      const data = await response.json();
      console.log('登录成功，收到的数据:', JSON.stringify(data));

      Cookies.set('token', data.token, { expires: 1 });
      console.log('Token已设置到Cookie中');

      console.log('准备跳转到dashboard页面');
      router.push('/dashboard');
    } catch (error) {
      console.error('登录过程中发生错误:', error);
      toast({
        title: '登录失败',
        description: '请检查您的邮箱和密码',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      console.log('错误提示已显示');
    }
  }

  const bgColor = useColorModeValue('gray.50', 'gray.800')
  // 删除这行: const textColor = useColorModeValue('gray.800', 'white')

  // 修复 borderColor 未定义的问题
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <Flex minHeight="100vh" bg={bgColor}>
      {/* 左侧插画 */}
      <Box width={{ base: "0", md: "50%" }} bg={useColorModeValue('brand.100.light', 'brand.100.dark')} position="relative">
        <Image
          src="/login-illustration.svg" // 请确保有这个矢量图文件
          alt="Login Illustration"
          objectFit="cover"
          width="100%"
          height="100%"
        />
      </Box>

      {/* 右侧登录表单 */}
      <Flex width={{ base: "100%", md: "50%" }} align="center" justify="center">
        <Container maxW="md" py={12}>
          <VStack spacing={8} align="flex-start" width="full">
            <VStack spacing={2} align="flex-start" width="full">
              <Heading size="xl" color={useColorModeValue('brand.700.light', 'brand.700.dark')}>欢迎回来</Heading>
              <Text color={useColorModeValue('brand.500.light', 'brand.500.dark')}>请登录您的账号</Text>
            </VStack>
            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              <VStack spacing={4} width="full">
                <Input
                  type="email"
                  placeholder="邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                  bg="white"
                  borderColor={borderColor}
                  _hover={{ borderColor: 'accent.500' }}
                  _focus={{ borderColor: 'accent.500', boxShadow: '0 0 0 1px accent.500' }}
                />
                <Input
                  type="password"
                  placeholder="密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="lg"
                  bg="white"
                  borderColor={borderColor}
                  _hover={{ borderColor: 'accent.500' }}
                  _focus={{ borderColor: 'accent.500', boxShadow: '0 0 0 1px accent.500' }}
                />
                <Button 
                  type="submit" 
                  width="full" 
                  bg="brand.500"
                  color="white"
                  _hover={{ bg: 'accent.500' }}
                  _active={{ bg: 'accent.600' }}
                  size="lg"
                  mt={4}
                >
                  登录
                </Button>
              </VStack>
            </form>
            <Text fontSize="sm" color={useColorModeValue('brand.500.light', 'brand.500.dark')} alignSelf="center">
              还没有账号？ <Button variant="link" color="accent.500" _hover={{ color: 'accent.600' }}>注册</Button>
            </Text>
          </VStack>
        </Container>
      </Flex>
    </Flex>
  )
}