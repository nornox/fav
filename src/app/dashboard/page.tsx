'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Flex,
  VStack,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  useColorMode,
  Tooltip,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import {
  FaBook,
  FaCalendar,
  FaTasks,
  FaPlus,
  FaUser,
  FaBars,
  FaSearch,
  FaMoon,
  FaSun,
} from 'react-icons/fa'
import { useColorModeValue } from '@chakra-ui/react'
import CollectionList from '@/components/CollectionList'
import { API_BASE_URL } from '@/config/api'
import Image from 'next/image'

import { CollectionListProps } from '../../type/CollectionListProps'

// 新增 Album 类型定义
type Album = {
  id: number
  title: string
  coverImage: string | null
  createdAt: string
  updatedAt: string
}

// 在文件顶部添加这个类型定义
type Collection = {
  id: number
  title: string
  type: string
  createdAt: string
  // 添加其他必要的字段
}

export default function DashboardPage() {
  const router = useRouter()
  const toast = useToast()
  const [isSidebarVisible, setIsSidebarVisible] = useState(true)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Collection[]>([])
  const { colorMode, toggleColorMode } = useColorMode()
  const [currentCmd, setCurrentCmd] = useState<CollectionListProps['cmd']>(
    'all',
  )
  const [albums, setAlbums] = useState<Album[]>([])

  const bgColor = useColorModeValue('brand.50.light', 'brand.50.dark')
  const textColor = useColorModeValue('brand.800.light', 'brand.800.dark')
  const borderColor = useColorModeValue('brand.200.light', 'brand.200.dark')
  const hoverBgColor = useColorModeValue('accent.500.light', 'accent.500.dark')
  const hoverColor = useColorModeValue('white', 'black')

  const selectedBgColor = useColorModeValue(
    'accent.500.light',
    'accent.500.dark',
  )

  const sidebarBgColor = useColorModeValue('brand.600.light', 'gray.900')
  const sidebarIconColor = useColorModeValue('white', 'gray.400')

  const openSearchModal = useCallback(() => {
    setIsSearchModalOpen(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        openSearchModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openSearchModal])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    // 这里应该调用实际的搜索 API
    // 现在我们只是模拟一个搜索结果
    const results = await fetch(
      `${API_BASE_URL}/collections/search?query=${query}`,
    )
    const data = await results.json()
    setSearchResults(data)
  }

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible)
  }

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('登出失败')
      }

      Cookies.remove('token')
      toast({
        title: '登出成功',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      router.push('/login')
    } catch (error) {
      console.error('登出失败:', error) 
      toast({
        title: '登出失败',
        description: '请稍后再试',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const fetchAlbums = useCallback(async () => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('未找到认证令牌')
      }

      const response = await fetch(`${API_BASE_URL}/collections/album`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}), // 如果需要传递其他参数，可以在这里添加
      })

      if (!response.ok) {
        throw new Error('获取合集列表失败')
      }

      const data = await response.json()
      setAlbums(data.albums)
    } catch (error) {
      console.error('获取合集列表时出错:', error)
      toast({
        title: '错误',
        description: '获取合集列表失败',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [toast])

  
  useEffect(() => {
    fetchAlbums()
  }, [fetchAlbums])

  
  return (
    <Flex minH="100vh" bg={bgColor}>
      {/* 左侧边栏 */}
      <Box
        position="fixed"
        left={isSidebarVisible ? 0 : '-50px'}
        top={0}
        bottom={0}
        width="50px"
        bg={sidebarBgColor}
        transition="left 0.3s"
        zIndex={20}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <VStack p={0.5} spacing={2} alignItems="center">
          <Tooltip label="Toggle Sidebar" placement="right">
            <IconButton
              icon={
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={30}
                  height={30}
                  layout="fixed"
                />
              }
              variant="ghost"
              color={sidebarIconColor}
              size="sm"
              _hover={{ bg: hoverBgColor }}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            />
          </Tooltip>
          <Tooltip label="Notes" placement="right">
            <IconButton
              icon={<FaBook />}
              variant="ghost"
              color={sidebarIconColor}
              size="sm"
              _hover={{ bg: hoverBgColor }}
              aria-label="Notes"
            />
          </Tooltip>
          <Tooltip label="Calendar" placement="right">
            <IconButton
              icon={<FaCalendar />}
              variant="ghost"
              color={sidebarIconColor}
              size="sm"
              _hover={{ bg: hoverBgColor }}
              aria-label="Calendar"
            />
          </Tooltip>
          <Tooltip label="Tasks" placement="right">
            <IconButton
              icon={<FaTasks />}
              variant="ghost"
              color={sidebarIconColor}
              size="sm"
              _hover={{ bg: hoverBgColor }}
              aria-label="Tasks"
            />
          </Tooltip>
          <Tooltip label="Add" placement="right">
            <IconButton
              icon={<FaPlus />}
              variant="ghost"
              color={sidebarIconColor}
              size="sm"
              _hover={{ bg: hoverBgColor }}
              aria-label="Add"
            />
          </Tooltip>
        </VStack>

        <VStack p={0.5} spacing={2} alignItems="center">
          <Tooltip label="User Menu" placement="right">
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaUser />}
                variant="ghost"
                color={sidebarIconColor}
                size="sm"
                _hover={{ bg: hoverBgColor }}
                aria-label="User menu"
              />
              <MenuList>
                <MenuItem>我的账户</MenuItem>
                <MenuItem onClick={handleLogout}>退出系统</MenuItem>
              </MenuList>
            </Menu>
          </Tooltip>
          <Tooltip
            label={`Switch to ${colorMode === 'light' ? 'Dark' : 'Light'} Mode`}
            placement="right"
          >
            <IconButton
              icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
              variant="ghost"
              color={sidebarIconColor}
              size="sm"
              _hover={{ bg: hoverBgColor }}
              onClick={toggleColorMode}
              aria-label="Toggle color mode"
            />
          </Tooltip>
        </VStack>
      </Box>

      {/* 侧边栏切换按钮 */}
      {!isSidebarVisible && (
        <IconButton
          icon={<FaBars />}
          position="fixed"
          left={0}
          top={2}
          zIndex={30}
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          size="sm"
        />
      )}

      {/* 主要内容区 */}
      <Flex
        flex={1}
        ml={isSidebarVisible ? '50px' : 0}
        transition="margin-left 0.3s"
      >
        {/* 左侧收藏分类 */}
        <VStack
          w="200px"
          bg={useColorModeValue('white', 'gray.800')}
          p={4}
          borderRightWidth={1}
          borderColor={borderColor}
          alignItems="stretch"
          spacing={4}
          minH="100%"
          justifyContent="space-between"
        >
          <VStack alignItems="stretch" spacing={3}>
            <Text fontWeight="bold" color={textColor} fontSize="md">
              收藏板块
            </Text>
            <VStack alignItems="stretch" spacing={1}>
              <Button
                justifyContent="flex-start"
                variant={currentCmd === 'all' ? 'solid' : 'ghost'}
                bg={currentCmd === 'all' ? selectedBgColor : 'transparent'}
                color={currentCmd === 'all' ? 'white' : textColor}
                _hover={{ bg: hoverBgColor, color: hoverColor }}
                size="sm"
                fontWeight="normal"
                fontSize="xs"
                onClick={() => setCurrentCmd('all')}
              >
                全部收藏
              </Button>
              <Button
                justifyContent="flex-start"
                variant={currentCmd === 'web' ? 'solid' : 'ghost'}
                bg={currentCmd === 'web' ? selectedBgColor : 'transparent'}
                color={currentCmd === 'web' ? 'white' : textColor}
                _hover={{ bg: hoverBgColor, color: hoverColor }}
                size="sm"
                fontWeight="normal"
                fontSize="xs"
                onClick={() => setCurrentCmd('web')}
              >
                网页收集箱
              </Button>
              <Button
                justifyContent="flex-start"
                variant={currentCmd === 'untagged' ? 'solid' : 'ghost'}
                bg={currentCmd === 'untagged' ? selectedBgColor : 'transparent'}
                color={currentCmd === 'untagged' ? 'white' : textColor}
                _hover={{ bg: hoverBgColor, color: hoverColor }}
                size="sm"
                fontWeight="normal"
                fontSize="xs"
                onClick={() => setCurrentCmd('untagged')}
              >
                未分类收藏
              </Button>
            </VStack>

            <Text fontWeight="bold" color={textColor} fontSize="md" mt={4}>
              我的合集
            </Text>
            <VStack alignItems="stretch" spacing={1}>
              {albums.map((album) => (
                <Box key={album.id}>
                  {album.coverImage && (
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      width={200}
                      height={200}
                      layout="responsive"
                    />
                  )}
                  <Button
                    justifyContent="flex-start"
                    variant={
                      currentCmd === `album_${album.id}` ? 'solid' : 'ghost'
                    }
                    bg={
                      currentCmd === `album_${album.id}`
                        ? selectedBgColor
                        : 'transparent'
                    }
                    color={
                      currentCmd === `album_${album.id}` ? 'white' : textColor
                    }
                    _hover={{ bg: hoverBgColor, color: hoverColor }}
                    size="sm"
                    fontWeight="normal"
                    fontSize="xs"
                    onClick={() => setCurrentCmd(`album_${album.id}`)}
                  >
                    {album.title}
                  </Button>
                </Box>
              ))}
            </VStack>
          </VStack>

          <Button
            colorScheme="brand"
            variant="outline"
            size="sm"
            _hover={{ bg: hoverBgColor, color: hoverColor }}
            onClick={() => setCurrentCmd('duplicate')}
          >
            查找重复收藏
          </Button>
        </VStack>

        {/* 右侧主内容 */}
        <Box
          flex={1}
          p={6}
          display="flex"
          flexDirection="column"
          minHeight="100vh"
        >
          <CollectionList cmd={currentCmd} onSearchClick={openSearchModal} />
        </Box>
      </Flex>

      {/* 搜索弹窗 */}
      <Modal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>搜索</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <FaSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="搜索收藏..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </InputGroup>
              <List spacing={3} width="100%">
                {searchResults.map((item) => (
                  <ListItem key={item.id} p={2} _hover={{ bg: 'gray.100' }}>
                    <Text fontWeight="bold">{item.title}</Text>
                    <Text fontSize="sm">类型: {item.type}</Text>
                    <Text fontSize="sm">
                      收藏时间: {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </ListItem>
                ))}
              </List>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}
