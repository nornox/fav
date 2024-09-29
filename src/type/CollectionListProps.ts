export type CollectionListProps = {
  cmd: 'all' | 'untagged' | 'web' | string // 'string' 用于自定义合集ID
  onSearchClick: () => void
}
