# QueryWeb3 前端

QueryWeb3 是一个现代化的区块链数据查询和可视化平台，支持查询和展示不同区块链网络的交易量、收益率等关键指标。

## 功能特点

- 🤖 **AI 聊天界面**：通过自然语言交互查询区块链数据
- 📊 **交易量分析**：查询并可视化展示交易量数据，支持历史数据对比
- 📈 **收益率数据**：全面的跨链收益率信息展示
- 🌐 **多链支持**：支持以太坊、BSC、Polygon等多个区块链
- 📱 **响应式设计**：完美适配桌面端和移动端
- 🌙 **暗黑模式**：内置暗黑模式支持

## 技术栈

- **前端框架**: [SvelteKit](https://kit.svelte.dev/)
- **UI组件**: [Flowbite-Svelte](https://flowbite-svelte.com/)
- **样式框架**: [Tailwind CSS](https://tailwindcss.com/)
- **图表库**: [Chart.js](https://www.chartjs.org/)
- **HTTP客户端**: [Axios](https://axios-http.com/)
- **日期处理**: [date-fns](https://date-fns.org/)
- **图标库**: [@tabler/icons-svelte](https://tabler-icons.io/)

## 环境要求

- Node.js (v18 或更高版本)
- Yarn 包管理器
- 后端服务 (参见 queryweb3-backend)

## 安装步骤

1. 克隆仓库：
```bash
git clone <仓库地址>
cd queryweb3-frontend
```

2. 安装依赖：
```bash
yarn install
```

3. 创建环境配置文件 `.env`：
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## 开发说明

启动开发服务器：
```bash
yarn dev
```

应用将在 `http://localhost:5173` 运行

## 生产环境构建

构建应用：
```bash
yarn build
```

预览生产构建：
```bash
yarn preview
```

## 项目结构

```
queryweb3-frontend/
├── src/
│   ├── lib/            # 共享组件和工具
│   │   ├── api.ts      # API客户端和类型定义
│   │   └── ...
│   ├── routes/         # 应用路由
│   │   ├── +page.svelte    # AI聊天页面
│   │   ├── vol-txns/       # 交易量查询
│   │   └── yield/          # 收益率查询
│   └── app.css        # 全局样式
├── static/           # 静态资源
├── vite.config.js    # Vite配置
└── tailwind.config.js # Tailwind CSS配置
```

## 功能详解

### AI 聊天界面
- 自然语言处理实现数据查询
- 上下文感知的响应
- 查询建议和自动补全

### 交易量查询
- 日期范围选择
- 区块链选择（以太坊、BSC、Polygon）
- 周期选项（日、周、月、年）
- 交互式图表和数据表格
- 同比和环比对比

### 收益率查询
- 日期选择
- 区块链筛选
- 资产类型筛选（DeFi、GameFi、NFT）
- 收益类型筛选（质押、挖矿、借贷）
- 代币筛选
- 全面的收益率指标展示

## API 接口

前端通过 RESTful API 与后端通信：

- `/api/v1/vol-txns/`: 交易量数据接口
- `/api/v1/yield/`: 收益率数据接口

详细的 API 客户端实现请参见 `src/lib/api.ts`。

## 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/新功能`)
3. 提交更改 (`git commit -m '添加新功能'`)
4. 推送到分支 (`git push origin feature/新功能`)
5. 提交 Pull Request

## 开源协议

本项目采用 MIT 协议 - 详见 LICENSE 文件

## 联系方式

项目地址：[https://github.com/Query-Web3/frontend](https://github.com/Query-Web3/frontend)

## 致谢

- [SvelteKit 文档](https://kit.svelte.dev/docs)
- [Flowbite 组件库](https://flowbite.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Chart.js 文档](https://www.chartjs.org/docs/latest/)
