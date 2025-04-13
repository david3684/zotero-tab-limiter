# Zotero Tab Limiter

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org)
[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)

Zotero标签页限制器是一个用于限制Zotero中可以打开的标签页数量的插件。当标签页数量超过配置的限制时，最早打开的标签页将自动关闭。

[English](../README.md) | [简体中文](./README-zhCN.md)

## 功能特点

- 当标签页数量超过限制时，自动关闭最早打开的标签页
- 通过首选项面板配置允许的最大标签页数量
- 自动检测标签页数量和首选项设置的变化
- 在后台无缝运行

## 安装

- 从[发布页面](https://github.com/yourusername/zotero-tab-limiter/releases)下载最新的发布版本(.xpi文件)
- 在Zotero中，进入"工具"→"插件"
- 点击齿轮图标并选择"从文件安装附加组件..."
- 选择下载的.xpi文件

## 使用方法

### 设置标签页限制

1. 进入"工具"→"插件"
2. 在列表中找到"Zotero Tab Limiter"并点击"首选项"
3. 输入您所需的最大标签页数量(最小为1)
4. 点击确定

### 工作原理

安装并配置完成后，插件会在后台自动工作：

- 当打开新标签页且总标签页数量超过您设置的限制时，最早的标签页将被关闭
- 当您更改最大标签页设置时，如果当前标签页数量超过新的限制，最早的标签页将立即关闭
- 插件使用最后访问时间来确定哪些标签页是最早的

## 开发

此插件基于[Zotero Plugin Template](https://github.com/windingwind/zotero-plugin-template)构建。

### 前提条件

- [Node.js](https://nodejs.org/) (v14或更高版本)
- [Zotero 7](https://www.zotero.org/support/beta_builds) (测试版)

### 开发设置

1. 克隆存储库

```bash
git clone https://github.com/yourusername/zotero-tab-limiter.git
cd zotero-tab-limiter
```

2. 安装依赖

```bash
npm install
```

3. 复制环境变量文件并配置

```bash
cp .env.example .env
```

更新`.env`文件，填入您的Zotero安装路径和配置文件

4. 启动开发服务器

```bash
npm start
```

### 构建

```bash
npm run build
```

构建好的插件将位于`build`目录中。

## 发布

要创建新版本：

```bash
npm run release
```

这将：

1. 提示输入新版本号
2. 更新package.json中的版本
3. 创建git标签
4. 将更改推送到GitHub
5. GitHub Actions将构建插件并创建发布

## 许可证

本项目采用[GNU Affero通用公共许可证v3.0](LICENSE)授权。

## 致谢

- [Zotero Plugin Template](https://github.com/windingwind/zotero-plugin-template) by [windingwind](https://github.com/windingwind)
- [Zotero Plugin Toolkit](https://github.com/windingwind/zotero-plugin-toolkit)
