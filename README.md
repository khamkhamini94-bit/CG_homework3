# CG_homework3
# CG_homework3: 光栅化场景渲染与着色

本项目是计算机图形学课程作业 3，基于 WebGL 实现了一个包含纹理贴图、Phong 光照模型以及阴影映射（Shadow Mapping）的 3D 场景渲染器。

## ✨ 实现功能

### 1. 基础功能 (90分)
* **纹理贴图 (Texture Mapping)**：
    * 实现了 `configureTexture` 函数，加载并应用了 2D 纹理。
    * 配置了 `LINEAR` 纹理过滤参数，解决了纹理缩放时的锯齿走样问题。
* **Phong 光照模型 (Phong Shading)**：
    * 在片元着色器中实现了环境光 (Ambient)、漫反射 (Diffuse) 和镜面反射 (Specular) 的计算。
* **阴影映射 (Shadow Mapping)**：
    * 实现了两趟渲染 (Two-pass rendering)：第一趟从光源视角生成深度贴图，第二趟渲染场景并计算阴影。
    * 在 Shader 中实现了基础的阴影判定逻辑。

### 2. 加强项 (10分)
* **阴影反走样 (Shadow Anti-aliasing / PCF)**：
    * 实现了 **Percentage-Closer Filtering (PCF)** 算法。
    * 通过对深度贴图进行 3x3 邻域采样并取平均值，成功消除了阴影边缘的锯齿，实现了柔和的软阴影效果。

## 🚀 运行说明

由于 WebGL 加载本地纹理图片受浏览器 **CORS (跨域资源共享)** 策略限制，**不能**直接双击 `.html` 文件打开。

**推荐运行方式：**
1.  使用 **Visual Studio Code** 打开项目文件夹。
2.  安装 **Live Server** 插件。
3.  右键点击 `Phongshading.html`，选择 **"Open with Live Server"**。

## 🎮 操作指南

### 键盘控制
| 按键 | 功能 |
| :--- | :--- |
| **空格** | 重置所有参数到初始状态 |
| **C** | 切换为 **点光源** 模式 |
| **V** | 切换为 **平行光源** 模式 |
| **W / S** | 光源绕 X 轴旋转 |
| **A / D** | 光源绕 Y 轴旋转 |
| **Y / U** | 拉大 / 缩小光源距离 |
| **M / N** | 调整视野角度 (FOV) - Zoom In/Out |
| **I / K** | 上下移动摄像机角度 |
| **J / L** | 左右移动摄像机角度 |
| **< / >** | 摄像机距离拉近 / 拉远 |

### 鼠标控制
* **左键拖拽**：旋转摄像机视角
* **中键拖拽**：平移观察中心
* **右键拖拽**：缩放视图 (Zoom)

## 📂 文件结构说明
* `Phongshading.html`: 程序入口网页
* `Phongshading.js`: WebGL 主逻辑文件
* `configTexture.js`: 纹理加载与配置
* `shaders/`: GLSL 着色器文件
    * `box.vert` / `box.frag`: 主场景着色器（包含光照与阴影计算）
    * `depth.vert` / `depth.frag`: 深度图生成着色器
* `Common/`: 数学库与工具函数
* `skybox/`: 天空盒纹理资源

---
*Generated for CG_homework3 submission.*