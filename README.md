# 🛍️ Project: Website Bán Hàng Cầu Lông

> Fullstack Monorepo — **Frontend (React/Vite)** + **Backend (Node/Express)** + **MySQL (Knex)**

## Mục lục

- [Mô tả](#mô-tả)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Tính năng chính](#tính-năng-chính)
- [Yêu cầu trước khi cài đặt](#yêu-cầu-trước-khi-cài-đặt)
- [Hướng dẫn cài đặt & khởi chạy (theo thứ tự)](#hướng-dẫn-cài-đặt--khởi-chạy-theo-thứ-tự)
  - [Bước 1 — Clone & cài thư viện](#bước-1-—-clone--cài-thư-viện)
  - [Bước 2 — Thiết lập Database](#bước-2-—-thiết-lập-database)
  - [Bước 3 — Chạy server và frontend](#bước-3-—-chạy-server-và-frontend)
  - [Bước 4 — Thiết lập Admin](#bước-4-—-thiết-lập-admin)
- [Cấu trúc thư mục (tóm tắt)](#cấu-trúc-thư-mục-tóm-tắt)
- [Các lệnh tiện ích](#các-lệnh-tiện-ích)
- [Gợi ý xử lý lỗi thường gặp](#gợi-ý-xử-lý-lỗi-thường-gặp)

---

## Mô tả

Đây là một website thương mại điện tử chuyên bán đồ cầu lông, được triển khai dưới dạng **monorepo** (tách frontend & backend). Mục tiêu là cung cấp trải nghiệm mua hàng mượt mà cho người dùng và một admin panel an toàn để quản lý users, products.

---

## Công nghệ sử dụng

- **Frontend (FE):** React (Vite), React Router, Context API (Auth, Cart), Axios
- **Backend (BE):** Node.js, Express.js, JWT (xác thực), Bcrypt (mã hóa mật khẩu)
- **Database:** MySQL, Knex.js (migrations & seed)

---

## Tính năng chính

- **Public (Người dùng):** Đăng ký/Đăng nhập, duyệt sản phẩm, trang chi tiết sản phẩm, giỏ hàng (Cart Context), phân trang sản phẩm.
- **Admin Panel (bảo vệ):** Quản lý users (xem, sửa, xóa, thay đổi role), quản lý sản phẩm (CRUD).
- **Trải nghiệm:** Đồng bộ giỏ hàng và trạng thái đăng nhập tức thì bằng Context API.

---

## Yêu cầu trước khi cài đặt

- Node.js (>=16) và npm
- MySQL server đang chạy
- Git

---

## Hướng dẫn cài đặt & khởi chạy (theo thứ tự)

> **Ghi chú:** làm đúng theo thứ tự dưới đây để tránh lỗi `Unknown database` hoặc lỗi kết nối.

### Bước 1 — Clone & cài thư viện

```bash
git clone https://github.com/eiusangthai/Project_A.git
cd Project_A
# Mở 2 terminal riêng biệt
# Terminal 1 (Backend)
cd be
npm install

# Terminal 2 (Frontend)
cd fe
npm install
```

### Bước 2 — Thiết lập Database

1. Mở MySQL (Workbench / CLI) và tạo database:

```sql
CREATE DATABASE shop;
```

2. Tạo file `.env` trong thư mục `be` với nội dung mẫu (sửa theo môi trường của bạn):

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456    # đổi thành mật khẩu thực tế
DB_NAME=shop          # phải trùng với tên database đã tạo
DB_PORT=3306
JWT_SECRET=matkhaubimatkhongaibiethet
```

3. Chạy migrations & seed để tạo bảng và nạp dữ liệu:

```bash
# Trong terminal BE
npx knex migrate:latest --knexfile knexfile.js  # chạy migrations tạo/cập nhật bảng
npx knex seed:run --knexfile knexfile.js        # nạp dữ liệu mẫu (products, menu...)
```

**Sau khi chạy xong, CSDL của bạn đã sẵn sàng.**

### Bước 3 — Chạy server và frontend

```bash
# Backend (terminal BE)
npm run dev  # khởi động server Express (mặc định port 5000)
# Terminal hiển thị: Server đang chạy ở port 5000

# Frontend (terminal FE)
# Tạo file .env.local trong fe
VITE_API_URL=http://localhost:5000/api

npm run dev  # khởi động app React (Vite)
```

### Bước 4 — Thiết lập Admin

1. Truy cập frontend, đăng ký tài khoản mới.
2. Trong MySQL, cấp role `admin` cho email bạn vừa đăng ký:

```sql
USE shop;
UPDATE users SET role = 'admin' WHERE email = 'email-tai-khoan-cua-ban@gmail.com';
```

3. Đăng nhập lại — bạn sẽ thấy link **Admin** trên header.

---

## Cấu trúc thư mục (tóm tắt)

```
Project_A/
├─ be/        # Backend - Express, routes, controllers, knex
├─ fe/        # Frontend - React (Vite), components, contexts
└─ README.md
```

---

## Các lệnh tiện ích

- `npm run dev` — chạy server (BE) hoặc app (FE)
- `npm run migrate` — chạy migrations (BE)
- `npx knex seed:run` — chạy seed dữ liệu (BE)

---

## Gợi ý xử lý lỗi thường gặp

- **Lỗi `Unknown database`**: kiểm tra tên database trong `.env` có khớp với database bạn đã tạo không.
- **Lỗi JSON Parse / 400 khi gửi request**: đảm bảo `Content-Type: application/json` và body gửi lên là JSON hợp lệ.
- **Không thể kết nối MySQL**: kiểm tra MySQL đang chạy, hostname, user, password, và port.
- **Admin không hiển thị**: kiểm tra trường `role` của user trong bảng `users` đã được cập nhật đúng chưa.

---
