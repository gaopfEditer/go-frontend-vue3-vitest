# Vue 页面自动测试策略

## 测试原理概述

### 1. **单元测试原理（Unit Testing）**

我们的测试遵循以下核心原理：

#### **隔离测试（Isolation）**
- 每个测试都是独立的，不依赖其他测试
- 使用 `beforeEach` 清理状态，确保测试间不相互影响
- Mock 外部依赖（API、Store、Message）

#### **AAA 模式（Arrange-Act-Assert）**
```javascript
it('应该验证密码匹配', async () => {
  // Arrange: 准备测试环境
  wrapper = mount(Login, { /* ... */ })
  
  // Act: 执行被测试的行为
  await wrapper.vm.toggleMode()
  wrapper.vm.form.password = 'password123'
  await wrapper.vm.handleSubmit()
  
  // Assert: 验证结果
  expect(mockMessage.error).toHaveBeenCalled()
})
```

#### **行为驱动测试（BDD - Behavior Driven Development）**
- 使用 `describe` 和 `it` 描述功能
- 测试描述清晰表达业务需求
- 模拟真实用户行为

### 2. **测试覆盖维度**

#### **功能维度（Functional Coverage）**
✅ **完整用户流程**
- 用户输入 → 验证 → 提交 → 成功/失败反馈

✅ **边界条件**
- 空值处理
- 最大值/最小值
- 特殊字符处理

✅ **错误处理**
- 网络错误
- 验证失败
- 服务器错误

#### **交互维度（Interaction Coverage）**
✅ **用户输入**
- 文本输入
- 密码输入
- 字段切换

✅ **状态切换**
- 登录 ↔ 注册模式
- 加载状态
- 语言切换

✅ **UI 响应**
- 元素显示/隐藏
- 样式变化
- 错误提示

#### **数据流维度（Data Flow Coverage）**
```javascript
// 1. 数据输入
form.email = 'user@example.com'

// 2. 数据处理
handleSubmit() // 验证、转换

// 3. 数据输出
store.login() // API 调用
```

### 3. **测试策略（Testing Strategy）**

#### **分层测试（Testing Pyramid）**

```
        /\
       /E2E\          ← 少量端到端测试（真实流程）
      /------\
     /Integration\    ← 集成测试（组件协作）
    /-----------\
   /   Unit      \    ← 大量单元测试（组件逻辑）
  /---------------\
```

#### **当前测试覆盖**

1. **单元测试层面**
   - 组件渲染
   - 数据绑定
   - 方法调用
   - 计算属性

2. **集成测试层面**
   - 组件 + Store
   - 组件 + i18n
   - 组件 + API

3. **E2E 测试层面**
   - 完整用户流程
   - 真实操作序列

## 如何保证测试全面性？

### 1. **需求分析矩阵**

创建一个需求覆盖矩阵，确保每个功能点都有测试：

| 功能模块 | 测试用例 | 优先级 | 状态 |
|---------|---------|--------|------|
| 表单渲染 | 输入框显示 | P0 | ✅ |
| 表单渲染 | 标题显示 | P0 | ✅ |
| 用户输入 | 邮箱输入 | P0 | ⚠️ |
| 用户输入 | 密码输入 | P0 | ⚠️ |
| 模式切换 | 登录/注册切换 | P1 | ✅ |
| 模式切换 | 表单清空 | P1 | ⚠️ |
| 语言切换 | 中英文切换 | P1 | ✅ |
| 表单验证 | 密码匹配验证 | P0 | ✅ |
| 表单验证 | 邮箱格式验证 | P0 | ⚠️ |
| 表单提交 | 登录成功 | P0 | ⚠️ |
| 表单提交 | 登录失败 | P0 | ⚠️ |
| 表单提交 | 注册流程 | P1 | ⚠️ |
| 错误处理 | API 错误 | P1 | ⚠️ |
| 错误处理 | 网络错误 | P1 | ⚠️ |

### 2. **测试覆盖率指标**

```bash
# 运行覆盖率报告
npm run test:coverage
```

**目标覆盖率：**
- 语句覆盖率（Statement）：> 80%
- 分支覆盖率（Branch）：> 70%
- 函数覆盖率（Function）：> 80%
- 行覆盖率（Line）：> 80%

### 3. **测试用例设计方法**

#### **等价类划分**
```javascript
// 有效输入
✅ 'user@example.com'
✅ 'admin@test.cn'

// 无效输入
❌ 'invalid-email'
❌ ''
❌ '@example.com'
```

#### **边界值分析**
```javascript
// 密码长度
✅ 6 字符（最小值）
❌ 5 字符
✅ 8 字符
✅ 20 字符
❌ 100 字符
```

#### **状态转换图**
```
登录模式 → 注册模式 → 登录模式
    ↓         ↓            ↓
  提交     提交        提交
    ↓         ↓            ↓
 成功     错误      验证失败
```

### 4. **Mock 策略**

#### **外部依赖 Mock**
```javascript
// API Mock
vi.mock('../src/utils/api', () => ({
  auth: {
    register: vi.fn(),
    login: vi.fn()
  }
}))

// Store Mock
vi.mock('../src/utils/stores', () => ({
  useStore: () => mockStore
}))
```

#### **异步操作 Mock**
```javascript
// 模拟延迟
await new Promise(resolve => setTimeout(resolve, 0))

// 模拟 API 响应
mockStore.login = vi.fn(() => Promise.resolve({}))
```

### 5. **测试清单（Testing Checklist）**

#### **功能完整性**
- [ ] 所有用户操作路径
- [ ] 所有错误情况
- [ ] 所有边界条件
- [ ] 所有业务规则

#### **UI 完整性**
- [ ] 元素显示/隐藏
- [ ] 样式正确
- [ ] 响应式布局
- [ ] 可访问性

#### **数据完整性**
- [ ] 数据验证
- [ ] 数据格式化
- [ ] 数据持久化
- [ ] 数据同步

## 测试最佳实践

### 1. **测试命名规范**
```javascript
describe('组件名', () => {
  it('应该...', () => {})
  it('不应该...', () => {})
  it('当...时，应该...', () => {})
})
```

### 2. **测试可读性**
- 使用描述性的测试名称
- 每个测试只验证一件事
- 使用数据驱动测试（表格驱动）

### 3. **测试维护性**
- 抽取公共逻辑到工具函数
- 使用 `beforeEach` 避免重复
- 保持测试简单

### 4. **测试性能**
- 避免真实的 API 调用
- 使用浅渲染（shallowMount）提高速度
- 并行执行测试

## 下一步改进建议

### 1. **增加测试用例**

#### **表单验证测试**
```javascript
it('应该验证邮箱格式', async () => {
  // 测试无效邮箱
  await wrapper.find('#email').setValue('invalid')
  expect(element.validity.valid).toBe(false)
})

it('应该验证密码最小长度', async () => {
  await wrapper.find('#password').setValue('12345')
  expect(element.validity.valid).toBe(false)
})
```

#### **加载状态测试**
```javascript
it('应该在提交时显示加载状态', async () => {
  wrapper.vm.loading = true
  await wrapper.vm.$nextTick()
  expect(wrapper.find('.login-button').attributes('disabled')).toBeDefined()
})
```

#### **错误处理测试**
```javascript
it('应该处理 API 错误', async () => {
  mockStore.login = vi.fn(() => Promise.reject(new Error('服务器错误')))
  await wrapper.vm.handleSubmit()
  expect(mockMessage.error).toHaveBeenCalledWith(expect.stringContaining('服务器错误'))
})
```

### 2. **增加集成测试**

测试组件与其他组件的交互：

```javascript
it('应该能在登录成功后导航到主页', async () => {
  // 模拟成功的登录
  // 验证路由跳转
})
```

### 3. **添加快照测试**

```javascript
it('应该匹配快照', () => {
  const wrapper = mount(Login)
  expect(wrapper.html()).toMatchSnapshot()
})
```

## 运行测试

```bash
# 开发模式运行测试
npm run test

# 查看测试覆盖率
npm run test:coverage

# 使用 UI 界面
npm run test:ui
```

## 总结

**测试的全面性保证方法：**

1. ✅ **需求导向** - 基于功能需求设计测试
2. ✅ **分层测试** - 单元 → 集成 → E2E
3. ✅ **覆盖率指标** - 确保达到目标覆盖率
4. ✅ **边界测试** - 覆盖极端情况
5. ✅ **Mock 策略** - 隔离外部依赖
6. ✅ **持续改进** - 根据缺陷补充测试

**记住：** 测试不是银弹，但全面的测试可以大大提高代码质量！

