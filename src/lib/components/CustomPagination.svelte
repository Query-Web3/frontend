<!-- 自定义分页组件 -->
<script lang="ts">
  import { Pagination } from 'flowbite-svelte';

  export let currentPage: number;
  export let totalPages: number;
  export let onPrevious: () => void;
  export let onNext: () => void;

  // 生成带省略号的分页项目列表
  function generatePaginationItems(
    current: number,
    total: number
  ): Array<{ name: string; href: string; active?: boolean }> {
    const items = [];
    const maxVisiblePages = 5;
    const halfMaxVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, current - halfMaxVisible);
    let endPage = Math.min(total, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 始终显示第一页
    if (startPage > 1) {
      items.push({ name: '1', href: '#' });
      if (startPage > 2) {
        items.push({ name: '...', href: '#' });
      }
    }

    // 添加可见的页码
    for (let i = startPage; i <= endPage; i++) {
      items.push({
        name: i.toString(),
        href: '#',
        active: i === current
      });
    }

    // 始终显示最后一页
    if (endPage < total) {
      if (endPage < total - 1) {
        items.push({ name: '...', href: '#' });
      }
      items.push({ name: total.toString(), href: '#' });
    }

    return items;
  }
</script>

<div class="flex items-center gap-4">
  <Pagination
    {totalPages}
    pages={generatePaginationItems(currentPage, totalPages)}
    on:previous={onPrevious}
    on:next={onNext}
  />
</div>