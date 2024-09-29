'use client'

import React from 'react'
import { Box, Heading, Text, Button, VStack, useColorModeValue } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.800', 'gray.100')

  return (
    <Box minHeight="100vh" bg={bgColor} color={textColor} display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={8} textAlign="center">
        <Heading as="h1" size="2xl">欢迎来到我的收藏系统</Heading>
        <Text fontSize="xl">这是一个帮助你管理和组织收藏的平台</Text>
        <Button colorScheme="blue" size="lg" onClick={() => router.push('/dashboard')}>
          进入仪表板
        </Button>
      </VStack>
    </Box>
  )
}
