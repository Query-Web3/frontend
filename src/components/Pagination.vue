<template>
    <div class="page flex items-center justify-between px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
            <a href="#"
                class="relative inline-flex items-center border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10">Previous</a>
            <a href="#"
                class="relative ml-3 inline-flex items-center border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-white/10">Next</a>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-gray-300">
                    Showing
                    {{ ' ' }}
                    <span class="font-medium">1</span>
                    {{ ' ' }}
                    to
                    {{ ' ' }}
                    <span class="font-medium">10</span>
                    {{ ' ' }}
                    of
                    {{ ' ' }}
                    <span class="font-medium">{{ props.total }}</span>
                    {{ ' ' }}
                    results
                </p>
            </div>

            <nav class="isolate inline-flex -space-x-px" aria-label="Pagination">
                <!-- 上一页 -->
                <div @click="handlePrev"
                    class="relative inline-flex items-center px-2 py-2 text-gray-400 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0">
                    <span class="sr-only">Previous</span>
                    <i class="iconfont left-arrow">&#xe602;</i>
                </div>

                <!-- 省略号（首页与当前页前3页之间） -->
                <div v-if="showFirstPage" :class="{ active: page === 1 }" @click="handlePageChange(1)"
                    class="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                    1</div>

                <span v-if="showPrevEllipsis"
                    class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 inset-ring inset-ring-gray-700 focus:outline-offset-0">...</span>


                <!-- 当前页前3页 -->
                <div @click="handlePageChange(cpage)" v-for="cpage in prevPages" 
                    class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-200 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0">
                    {{ cpage }}</div>
                    
                <!-- 当前页 -->
                <div @click="handlePageChange(page)"
                    class="active relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-200 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0 md:inline-flex">
                    {{ page }}</div>

                <!-- 当前页后3页 -->
                <div v-for="cpage in nextPages" :key="cpage" @click="handlePageChange(cpage)"
                    class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-200 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0">
                    {{ cpage }}</div>

                <!-- 省略号（当前页后3页与末页之间） -->
                <span v-if="showNextEllipsis"
                    class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-400 inset-ring inset-ring-gray-700 focus:outline-offset-0">...</span>

                <!-- 末页（仅在当前页后有足够页码时显示） -->
                <div v-if="showLastPage" @click="handlePageChange(totalPages)" 
                    class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-200 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0">
                    {{ totalPages }}</div>

                <!-- 下一页 -->
                <div @click="handleNext"
                    class="relative inline-flex items-center px-2 py-2 text-gray-400 inset-ring inset-ring-gray-700 hover:bg-white/5 focus:z-20 focus:outline-offset-0">
                    <span class="sr-only">Next</span>
                    <i class="iconfont">&#xe602;</i>
                </div>
            </nav>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps(["size", "page", "total"])
const emit = defineEmits(["page-change"]);

const totalPages = computed(() => {
    if (props.total <= 0) return 1;
    return Math.ceil(props.total / props.size);
});

const prevPages = computed(() => {
    const pages = [];
    // 从当前页-3开始，最小到1
    const start = Math.max(1, props.page - 3);
    // 结束到当前页-1
    const end = props.page - 1;

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

// 计算当前页后3页的页码
const nextPages = computed(() => {
    const pages = [];
    // 从当前页+1开始
    const start = props.page + 1;
    // 结束到当前页+3，最大不超过总页数
    const end = Math.min(totalPages.value, props.page + 3);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});

// 是否显示首页（当前页前3页大于1时）
const showFirstPage = computed(() => {
    return props.page - 3 > 1;
});

// 是否显示前省略号（首页和前3页之间有间隔）
const showPrevEllipsis = computed(() => {
    return props.page - 3 > 2;
});

// 是否显示末页（当前页后3页小于总页数时）
const showLastPage = computed(() => {
    return props.page + 3 < totalPages.value;
});

// 是否显示后省略号（后3页和末页之间有间隔）
const showNextEllipsis = computed(() => {
    return props.page + 3 < totalPages.value - 1;
});

// 页码变更处理
const handlePageChange = (page: number) => {
    // 边界校验
    if (page < 1 || page > totalPages.value) return;
    if (page === props.page) return;
    emit('page-change', page);
};

// 上一页
const handlePrev = () => {
    if (props.page > 1) {
        emit('page-change', props.page - 1);
    }
};

// 下一页
const handleNext = () => {
    if (props.page < totalPages.value) {
        emit('page-change', props.page + 1);
    }
};

</script>

<style lang="scss" scoped>
.page {
    margin-top: 10px;
    background-color: rgba(33, 33, 33, 0.42);

    .active {
        background-color: #0000002a;
    }

    .left-arrow {
        transform: rotate(180deg);
    }
}
</style>