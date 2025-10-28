# Less 样式预处理器使用指南

本项目已集成 Less 预处理器，支持变量、混入、嵌套等 Less 特性。

## 文件结构

```
src/styles/
├── variables.less    # Less 变量定义
├── mixins.less      # Less 混入定义
├── example.less     # 使用示例
└── README.md        # 使用说明
```

## 使用方法

### 1. 在 Vue 组件中使用 Less

```vue
<template>
  <div class="my-component">
    <h1>标题</h1>
    <p>内容</p>
  </div>
</template>

<style lang="less" scoped>
@import '@/styles/variables.less';
@import '@/styles/mixins.less';

.my-component {
  padding: @spacing-lg;
  background: #fff;
  border-radius: @border-radius-base;
  
  h1 {
    color: @primary-color;
    font-size: @font-size-large;
  }
  
  p {
    .text-ellipsis();
    margin-top: @spacing-md;
  }
}
</style>
```

### 2. 使用变量

```less
// 在 variables.less 中定义
@primary-color: #409eff;
@spacing-lg: 24px;

// 在组件中使用
.my-class {
  color: @primary-color;
  padding: @spacing-lg;
}
```

### 3. 使用混入 (Mixins)

```less
// 在 mixins.less 中定义
.flex-center() {
  display: flex;
  align-items: center;
  justify-content: center;
}

// 在组件中使用
.container {
  .flex-center();
}
```

### 4. 嵌套选择器

```less
.form {
  padding: @spacing-md;
  
  .form-item {
    margin-bottom: @spacing-sm;
    
    .label {
      font-weight: bold;
      color: @info-color;
    }
    
    .input {
      width: 100%;
      padding: @spacing-sm;
      
      &:focus {
        border-color: @primary-color;
      }
    }
  }
}
```

### 5. 运算和函数

```less
.sidebar {
  width: 200px;
  margin-left: @spacing-lg + 10px;
  
  .item {
    padding: @spacing-sm * 2;
    background: lighten(@primary-color, 20%);
  }
}
```

## 配置说明

### Vite 配置

在 `vite.config.js` 中已配置 Less 支持：

```javascript
css: {
  preprocessorOptions: {
    less: {
      additionalData: `${styleCssContent}`,
      modifyVars: {
        // 可以在这里定义全局 Less 变量
      }
    }
  }
}
```

### 全局变量注入

所有 Less 文件都会自动注入 `style.css` 的内容，可以通过 `@import` 引入变量和混入。

## 最佳实践

1. **变量命名**：使用语义化的变量名，如 `@primary-color`、`@spacing-lg`
2. **文件组织**：将变量和混入分别放在独立的文件中
3. **嵌套层级**：避免过深的嵌套（建议不超过 3 层）
4. **性能优化**：合理使用混入，避免重复代码

## 示例文件

查看 `example.less` 文件了解完整的使用示例。
