# API Specification

## 1. Quản lý người dùng (Users)

### 1.1. Lấy danh sách người dùng
- **Endpoint**: `GET /api/users`
- **Query Parameters**:
  - `page`: Số trang (mặc định: 1)
  - `limit`: Số lượng item mỗi trang (mặc định: 10)
  - `search`: Từ khóa tìm kiếm (tên, email, số điện thoại)
  - `role`: Lọc theo vai trò (admin, manager, staff)
  - `status`: Lọc theo trạng thái (active, inactive)
- **Response**:
```typescript
{
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### 1.2. Thêm người dùng mới
- **Endpoint**: `POST /api/users`
- **Request Body**:
```typescript
{
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
}
```
- **Response**: User object

### 1.3. Cập nhật thông tin người dùng
- **Endpoint**: `PUT /api/users/:id`
- **Request Body**: Tương tự như thêm mới
- **Response**: User object

### 1.4. Xóa người dùng
- **Endpoint**: `DELETE /api/users/:id`
- **Response**: Success message

### 1.5. Thay đổi trạng thái người dùng
- **Endpoint**: `PATCH /api/users/:id/status`
- **Request Body**:
```typescript
{
  status: 'active' | 'inactive';
}
```
- **Response**: User object

## 2. Quản lý phòng (Rooms)

### 2.1. Lấy danh sách phòng
- **Endpoint**: `GET /api/rooms`
- **Query Parameters**:
  - `page`: Số trang
  - `limit`: Số lượng item mỗi trang
  - `search`: Từ khóa tìm kiếm
  - `status`: Lọc theo trạng thái (vacant, occupied, maintenance)
  - `type`: Lọc theo loại phòng
- **Response**:
```typescript
{
  rooms: Room[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### 2.2. Thêm phòng mới
- **Endpoint**: `POST /api/rooms`
- **Request Body**:
```typescript
{
  name: string;
  type: string;
  floor: number;
  area: number;
  price: number;
  status: 'vacant' | 'occupied' | 'maintenance';
  description?: string;
  amenities?: string[];
}
```
- **Response**: Room object

### 2.3. Cập nhật thông tin phòng
- **Endpoint**: `PUT /api/rooms/:id`
- **Request Body**: Tương tự như thêm mới
- **Response**: Room object

### 2.4. Xóa phòng
- **Endpoint**: `DELETE /api/rooms/:id`
- **Response**: Success message

## 3. Quản lý người thuê (Tenants)

### 3.1. Lấy danh sách người thuê
- **Endpoint**: `GET /api/tenants`
- **Query Parameters**:
  - `page`: Số trang
  - `limit`: Số lượng item mỗi trang
  - `search`: Từ khóa tìm kiếm
  - `status`: Lọc theo trạng thái (active, inactive)
- **Response**:
```typescript
{
  tenants: Tenant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### 3.2. Thêm người thuê mới
- **Endpoint**: `POST /api/tenants`
- **Request Body**:
```typescript
{
  name: string;
  phone: string;
  email: string;
  identityCard: string;
  dateOfBirth: string;
  address: string;
  startDate: string;
  endDate: string;
  roomId: string;
  avatar?: string;
}
```
- **Response**: Tenant object

### 3.3. Cập nhật thông tin người thuê
- **Endpoint**: `PUT /api/tenants/:id`
- **Request Body**: Tương tự như thêm mới
- **Response**: Tenant object

### 3.4. Xóa người thuê
- **Endpoint**: `DELETE /api/tenants/:id`
- **Response**: Success message

## 4. Quản lý hợp đồng (Contracts)

### 4.1. Lấy danh sách hợp đồng
- **Endpoint**: `GET /api/contracts`
- **Query Parameters**:
  - `page`: Số trang
  - `limit`: Số lượng item mỗi trang
  - `search`: Từ khóa tìm kiếm
  - `status`: Lọc theo trạng thái (active, expired)
- **Response**:
```typescript
{
  contracts: Contract[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### 4.2. Tạo hợp đồng mới
- **Endpoint**: `POST /api/contracts`
- **Request Body**:
```typescript
{
  tenantId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  deposit: number;
  monthlyRent: number;
  terms: string[];
}
```
- **Response**: Contract object

### 4.3. Gia hạn hợp đồng
- **Endpoint**: `POST /api/contracts/:id/renew`
- **Request Body**:
```typescript
{
  newEndDate: string;
  newMonthlyRent?: number;
}
```
- **Response**: Contract object

### 4.4. Chấm dứt hợp đồng
- **Endpoint**: `POST /api/contracts/:id/terminate`
- **Request Body**:
```typescript
{
  reason: string;
  terminationDate: string;
}
```
- **Response**: Contract object

## 5. Quản lý tài chính (Finances)

### 5.1. Lấy danh sách giao dịch
- **Endpoint**: `GET /api/transactions`
- **Query Parameters**:
  - `page`: Số trang
  - `limit`: Số lượng item mỗi trang
  - `type`: Loại giao dịch (income, expense)
  - `startDate`: Ngày bắt đầu
  - `endDate`: Ngày kết thúc
  - `search`: Từ khóa tìm kiếm
- **Response**:
```typescript
{
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  }
}
```

### 5.2. Thêm giao dịch mới
- **Endpoint**: `POST /api/transactions`
- **Request Body**:
```typescript
{
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  roomId?: string;
  tenantId?: string;
}
```
- **Response**: Transaction object

### 5.3. Lấy báo cáo tài chính
- **Endpoint**: `GET /api/finances/report`
- **Query Parameters**:
  - `startDate`: Ngày bắt đầu
  - `endDate`: Ngày kết thúc
- **Response**:
```typescript
{
  monthlyData: {
    month: string;
    income: number;
    expense: number;
    balance: number;
  }[];
  categorySummary: {
    income: {
      category: string;
      total: number;
      percent: number;
    }[];
    expense: {
      category: string;
      total: number;
      percent: number;
    }[];
  }
}
```

## 6. Quản lý bảo trì (Maintenance)

### 6.1. Lấy danh sách bảo trì
- **Endpoint**: `GET /api/maintenance`
- **Query Parameters**:
  - `page`: Số trang
  - `limit`: Số lượng item mỗi trang
  - `status`: Trạng thái (pending, in_progress, completed, cancelled)
  - `type`: Loại bảo trì (preventive, corrective, predictive)
  - `startDate`: Ngày bắt đầu
  - `endDate`: Ngày kết thúc
- **Response**:
```typescript
{
  maintenances: Maintenance[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### 6.2. Tạo yêu cầu bảo trì mới
- **Endpoint**: `POST /api/maintenance`
- **Request Body**:
```typescript
{
  equipmentId: string;
  equipmentName: string;
  maintenanceType: 'preventive' | 'corrective' | 'predictive';
  description: string;
  startDate: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
}
```
- **Response**: Maintenance object

### 6.3. Cập nhật trạng thái bảo trì
- **Endpoint**: `PATCH /api/maintenance/:id/status`
- **Request Body**:
```typescript
{
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
}
```
- **Response**: Maintenance object

## 7. Cài đặt hệ thống (Settings)

### 7.1. Lấy thông tin cài đặt
- **Endpoint**: `GET /api/settings`
- **Response**:
```typescript
{
  buildingInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  userPreferences: {
    language: string;
    notifications: boolean;
    emailNotifications: boolean;
    currency: string;
    timezone: string;
    dateFormat: string;
  };
  categories: {
    income: string[];
    expense: string[];
  };
}
```

### 7.2. Cập nhật thông tin tòa nhà
- **Endpoint**: `PUT /api/settings/building`
- **Request Body**:
```typescript
{
  name: string;
  address: string;
  phone: string;
  email: string;
}
```
- **Response**: Building info object

### 7.3. Cập nhật tùy chọn người dùng
- **Endpoint**: `PUT /api/settings/preferences`
- **Request Body**:
```typescript
{
  language: string;
  notifications: boolean;
  emailNotifications: boolean;
  currency: string;
  timezone: string;
  dateFormat: string;
}
```
- **Response**: User preferences object

### 7.4. Cập nhật danh mục
- **Endpoint**: `PUT /api/settings/categories`
- **Request Body**:
```typescript
{
  income: string[];
  expense: string[];
}
```
- **Response**: Categories object 