<!-- 自定义分页组件 -->
<script lang="ts">
  export let currentPage: number;
  export let totalPages: number;
  export let onPrevious: () => void;
  export let onNext: () => void;
  export let itemsPerPage: number = 10;
  export let totalItems: number = 100;

  // 生成页码列表
  function generatePageNumbers(current: number, total: number): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (total <= maxVisiblePages) {
      // 如果总页数小于等于最大可见页数，显示所有页码
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // 总是显示第一页
      pages.push(1);

      // 计算中间页码的范围
      let start = Math.max(2, current - 1);
      let end = Math.min(total - 1, start + 2);
      
      // 调整起始位置以确保显示三个数字
      if (end - start < 2) {
        start = Math.max(2, end - 2);
      }

      // 添加省略号
      if (start > 2) {
        pages.push(-1); // -1 表示省略号
      }

      // 添加中间页码
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // 添加省略号
      if (end < total - 1) {
        pages.push(-1); // -1 表示省略号
      }

      // 总是显示最后一页
      pages.push(total);
    }

    return pages;
  }

  $: pageNumbers = generatePageNumbers(currentPage, totalPages);

  function handlePageClick(page: number) {
    if (page === currentPage) return;
    if (page > currentPage) {
      onNext();
    } else {
      onPrevious();
    }
  }
</script>

<div class="flex items-center gap-2 text-sm">
  <span class="mr-2">共{totalItems}/{itemsPerPage}条数据</span>
  
  <!-- 上一页按钮 -->
  <button
    class="px-2 border rounded"
    on:click={onPrevious}
    disabled={currentPage === 1}
  >
    ‹
  </button>

  <!-- 页码按钮 -->
  {#each pageNumbers as page}
    {#if page === -1}
      <span>...</span>
    {:else}
      <button
        class="px-2 border rounded"
        class:bg-primary-600={currentPage === page}
        class:text-white={currentPage === page}
        on:click={() => handlePageClick(page)}
      >
        {page}
      </button>
    {/if}
  {/each}

  <!-- 下一页按钮 -->
  <button
    class="px-2 border rounded"
    on:click={onNext}
    disabled={currentPage === totalPages}
  >
    ›
  </button>

  <!-- 跳转输入框 -->
  <span class="ml-2">跳至</span>
  <input
    type="number"
    class="w-8 h-6 px-0.5 border rounded text-center text-sm"
    min="1"
    max={totalPages}
    bind:value={currentPage}
  />
  <span>页</span>
</div>