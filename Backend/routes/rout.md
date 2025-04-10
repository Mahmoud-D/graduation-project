بالطبع! إليك توثيقًا مقترحًا للـ API مع الـ routes الخاصة بقاعدة البيانات التي تحدثنا عنها. سيتم تقسيم التوثيق إلى الأقسام الأساسية مع ذكر كافة الـ routes المتاحة.

---

### **API Documentation: Restaurant System**

---

### **1. Users Routes (جدول المستخدمين)**

#### **1.1 الحصول على قائمة جميع المستخدمين**

- **Route**: `GET /api/users`
- **Description**: يحصل على جميع المستخدمين في النظام.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "created_at": "2025-01-01T12:00:00Z"
    }
  ]
  ```

#### **1.2 إضافة مستخدم جديد**

- **Route**: `POST /api/users`
- **Description**: إضافة مستخدم جديد (مثل زبون، طاهٍ، أو مالك).
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "created_at": "2025-01-01T12:00:00Z"
  }
  ```

#### **1.3 الحصول على تفاصيل مستخدم بواسطة ID**

- **Route**: `GET /api/users/:id`
- **Description**: يحصل على تفاصيل مستخدم معين باستخدام معرفه.
- **Response**:
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "created_at": "2025-01-01T12:00:00Z"
  }
  ```

#### **1.4 تحديث بيانات مستخدم**

- **Route**: `PUT /api/users/:id`
- **Description**: تحديث بيانات مستخدم معين.
- **Request Body**:
  ```json
  {
    "name": "John Updated",
    "email": "john_updated@example.com",
    "role": "chef"
  }
  ```

#### **1.5 حذف مستخدم**

- **Route**: `DELETE /api/users/:id`
- **Description**: حذف مستخدم معين.
- **Response**:
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

---

### **2. Dishes Routes (جدول الأطباق)**

#### **2.1 الحصول على قائمة الأطباق**

- **Route**: `GET /api/dishes`
- **Description**: يحصل على جميع الأطباق في النظام.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "Pizza Margherita",
      "description": "Classic pizza with tomato and mozzarella",
      "price": 10.99,
      "category": "Pizza",
      "created_at": "2025-01-01T12:00:00Z"
    }
  ]
  ```

#### **2.2 إضافة طبق جديد**

- **Route**: `POST /api/dishes`
- **Description**: إضافة طبق جديد.
- **Request Body**:
  ```json
  {
    "name": "Pizza Margherita",
    "description": "Classic pizza with tomato and mozzarella",
    "price": 10.99,
    "category": "Pizza"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "name": "Pizza Margherita",
    "description": "Classic pizza with tomato and mozzarella",
    "price": 10.99,
    "category": "Pizza",
    "created_at": "2025-01-01T12:00:00Z"
  }
  ```

#### **2.3 الحصول على تفاصيل طبق بواسطة ID**

- **Route**: `GET /api/dishes/:id`
- **Description**: يحصل على تفاصيل طبق معين.
- **Response**:
  ```json
  {
    "id": 1,
    "name": "Pizza Margherita",
    "description": "Classic pizza with tomato and mozzarella",
    "price": 10.99,
    "category": "Pizza",
    "created_at": "2025-01-01T12:00:00Z"
  }
  ```

#### **2.4 تحديث طبق**

- **Route**: `PUT /api/dishes/:id`
- **Description**: تحديث بيانات طبق معين.
- **Request Body**:
  ```json
  {
    "name": "Pizza Margherita Deluxe",
    "description": "Classic pizza with tomato, mozzarella, and basil",
    "price": 12.99,
    "category": "Pizza"
  }
  ```

#### **2.5 حذف طبق**

- **Route**: `DELETE /api/dishes/:id`
- **Description**: حذف طبق معين.
- **Response**:
  ```json
  {
    "message": "Dish deleted successfully"
  }
  ```

---

### **3. Orders Routes (جدول الطلبات)**

#### **3.1 الحصول على قائمة الطلبات**

- **Route**: `GET /api/orders`
- **Description**: يحصل على جميع الطلبات.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "status": "pending",
      "created_at": "2025-01-01T12:00:00Z",
      "updated_at": "2025-01-01T12:30:00Z"
    }
  ]
  ```

#### **3.2 إضافة طلب جديد**

- **Route**: `POST /api/orders`
- **Description**: إضافة طلب جديد من الزبون.
- **Request Body**:
  ```json
  {
    "user_id": 1,
    "status": "pending"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "user_id": 1,
    "status": "pending",
    "created_at": "2025-01-01T12:00:00Z",
    "updated_at": "2025-01-01T12:30:00Z"
  }
  ```

#### **3.3 الحصول على تفاصيل طلب بواسطة ID**

- **Route**: `GET /api/orders/:id`
- **Description**: يحصل على تفاصيل طلب معين.
- **Response**:
  ```json
  {
    "id": 1,
    "user_id": 1,
    "status": "pending",
    "created_at": "2025-01-01T12:00:00Z",
    "updated_at": "2025-01-01T12:30:00Z"
  }
  ```

#### **3.4 تحديث حالة الطلب**

- **Route**: `PUT /api/orders/:id`
- **Description**: تحديث حالة الطلب.
- **Request Body**:
  ```json
  {
    "status": "in progress"
  }
  ```

#### **3.5 حذف طلب**

- **Route**: `DELETE /api/orders/:id`
- **Description**: حذف طلب معين.
- **Response**:
  ```json
  {
    "message": "Order deleted successfully"
  }
  ```

---

### **4. Chefs Routes (جدول الطهاة)**

#### **4.1 الحصول على قائمة الطهاة**

- **Route**: `GET /api/chefs`
- **Description**: يحصل على جميع الطهاة.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "Chef John",
      "role": "Pizza Chef",
      "created_at": "2025-01-01T12:00:00Z"
    }
  ]
  ```

#### **4.2 إضافة طاهٍ جديد**

- **Route**: `POST /api/chefs`
- **Description**: إضافة طاهٍ جديد.
- **Request Body**:
  ```json
  {
    "name": "Chef John",
    "user_id": 1,
    "role": "Pizza Chef"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "name": "Chef John",
    "role": "Pizza Chef",
    "created_at": "2025-01-01T12:00:00Z"
  }
  ```

---

### **5. Tasks Routes (جدول المهام)**

#### **5.1 الحصول على قائمة المهام**

- **Route**: `GET /api/tasks`
- **Description**: يحصل على جميع المهام.
- **Response**:
  ```json
  [
    {
      "id": 1,
      "chef_id": 1,
      "order_id": 1,
      "dish_id": 1,
      "status": "in progress",
      "assigned_at": "2025-01-01T12:00:00Z",
      "completed_at": null
    }
  ]
  ```

#### **5.2 إضافة مهمة جديدة**

- **Route**: `POST /api/tasks`
- **Description**: إضافة مهمة جديدة للطاهي.
- **Request Body**:
  ```json
  {
    "chef_id": 1,
    "order_id": 1,
    "dish_id": 1,
    "status": "assigned"
  }
  ```
- **Response**:
  ```json
  {
    "id": 1,
    "chef_id": 1,
    "order_id": 1,
    "dish_id": 1,
    "status": "assigned",
    "assigned_at": "2025-01-01T12:00:00Z",
    "completed_at": null
  }
  ```

---

### **الخلاصة:**

- تم توثيق **routes** التي تشمل الـ Users, Dishes, Orders, Chefs, وTasks.
- تم توضيح كيفية إضافة، تحديث، الحصول على، وحذف البيانات المتعلقة بكل جدول.

---

هل تحتاج إلى أي إضافات أخرى أو أي توضيح للمزيد من التفاصيل؟