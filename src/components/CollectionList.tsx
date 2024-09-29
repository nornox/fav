'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  SimpleGrid,
  Text,
  Button,
  Flex,
  Select,
  useColorModeValue,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Image,
  IconButton,
} from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'
import { API_BASE_URL } from '@/config/api'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { CollectionListProps } from '../type/CollectionListProps'

// 更新 Collection 类型定义
type Collection = {
  id: number
  title: string
  coverImage: string | null
  createdAt: string
  updatedAt: string
  type: 'url' | 'pic' | 'text' | 'mixed'
  url: string
  hasTag: boolean
}

// 添加分页信息类型
type Pagination = {
  currentPage: number
  totalPages: number
  totalItems: number
}

const CollectionList: React.FC<CollectionListProps> = ({
  cmd,
  onSearchClick,
}) => {
  const [collections, setCollections] = useState<Collection[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  })
  const [sortOrder, setSortOrder] = useState('最新收藏')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const toast = useToast()

  const bgColor = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.800', 'white')
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400')

  const fetchCollections = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('未找到认证令牌')
      }

      const url = `${API_BASE_URL}/collections/list`
      const body: Record<string, unknown> = {
        sort: sortOrder,
        page: pagination.currentPage,
      }

      // 处理 album_id 的情况
      if (cmd.startsWith('album_')) {
        const albumId = cmd.split('_')[1]
        body.cmd = 'album'
        body.albumId = albumId
      } else {
        body.cmd = cmd
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          throw new Error('认证失败，请重新登录')
        }
        throw new Error('获取收藏列表失败')
      }

      const data = await response.json()
      setCollections(data.collections)
      setPagination(data.pagination)
    } catch (error) {
      console.error('获取收藏列表时出错:', error)
      setError(
        '加载收藏失败。请稍后再试。' +
          (error instanceof Error ? error.message : '未知错误'),
      )
      toast({
        title: '错误',
        description: error instanceof Error ? error.message : '未知错误',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }, [cmd, sortOrder, pagination.currentPage, router, toast])

  
  useEffect(() => {
    fetchCollections()
  }, [fetchCollections]) // 添加 fetchCollections 作为依赖项

  const SkeletonCard = () => (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="md"
      borderWidth={1}
      borderColor={borderColor}
    >
      <Skeleton height="20px" width="80%" mb={2} />
      <Skeleton height="14px" width="100%" mb={2} />
      <Skeleton height="14px" width="60%" />
      <Skeleton height="10px" width="40%" mt={2} />
    </Box>
  )

  return (
    <Box>
      <Flex justifyContent="flex-end" alignItems="center" mb={4}>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          width="250px"
          mr={2}
        >
          <option value="最新收藏">按收藏时间由晚到早</option>
          <option value="最早收藏">按收藏时间由早到晚</option>
          <option value="标题正序">按标题正序排列</option>
          <option value="标题倒序">按标题倒序排列</option>
        </Select>
        <IconButton
          icon={<FaSearch />}
          aria-label="Search"
          onClick={onSearchClick}
        />
      </Flex>

      {isLoading ? (
        <SimpleGrid columns={4} spacing={4}>
          {[...Array(8)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </SimpleGrid>
      ) : error ? (
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            加载失败
          </AlertTitle>
          <AlertDescription maxWidth="sm">{error}</AlertDescription>
          <Button mt={4} colorScheme="blue" onClick={fetchCollections}>
            重试
          </Button>
        </Alert>
      ) : collections.length > 0 ? (
        <SimpleGrid columns={4} spacing={4}>
          {collections.map((collection) => (
            <Box
              key={collection.id}
              bg={bgColor}
              p={4}
              borderRadius="md"
              borderWidth={1}
              borderColor={borderColor}
            >
              {collection.coverImage && (
                <Image
                  src={collection.coverImage}
                  alt={collection.title}
                  mb={2}
                />
              )}
              <Text fontWeight="bold" mb={2} color={textColor}>
                {collection.title}
              </Text>
              <Text fontSize="xs" color={secondaryTextColor} mb={2}>
                类型: {collection.type}
              </Text>
              <Text fontSize="xs" color={secondaryTextColor} mb={2}>
                URL: {collection.url}
              </Text>
              <Text fontSize="xs" color={secondaryTextColor}>
                创建时间: {new Date(collection.createdAt).toLocaleDateString()}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text textAlign="center" color={textColor}>
          没有找到收藏项目
        </Text>
      )}

      <Flex justifyContent="center" mt={8}>
        <Button
          size="sm"
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              currentPage: Math.max(prev.currentPage - 1, 1),
            }))
          }
          disabled={pagination.currentPage === 1}
        >
          上一页
        </Button>
        <Button size="sm" variant="solid" mx={2}>
          {pagination.currentPage} / {pagination.totalPages}
        </Button>
        <Button
          size="sm"
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              currentPage: Math.min(prev.currentPage + 1, prev.totalPages),
            }))
          }
          disabled={pagination.currentPage === pagination.totalPages}
        >
          下一页
        </Button>
      </Flex>
    </Box>
  )
}

export default CollectionList
