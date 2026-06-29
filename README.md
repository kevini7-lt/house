# 房源展示管理 Demo

微信原生小程序示例项目，定位为房东可演示的房源展示管理 Demo。

## 特点

- 原生小程序开发，不使用 UniApp、Taro、Vue
- 所有页面数据统一走 service 层
- 当前使用 mock JSON，后续可平滑替换为 Node.js + MySQL 接口
- 目录按企业常见分层组织：`pages`、`components`、`services`、`mock`、`theme`、`utils`

## 页面

1. 首页
2. 楼栋页面
3. 房间列表
4. 房间详情
5. 管理员 Demo

## 说明

- 首页、楼栋、房间、详情页数据都来自 `services`
- 页面不直接读取 JSON
- 管理员页面所有按钮均为 Demo Toast
- 房间详情页的 `videoUrl` 目前指向公开演示地址，正式版可直接替换成后端返回的本地媒体地址

