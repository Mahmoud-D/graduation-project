# 🎯 Database Design for `users`

| **Column Name** | **Data Type**            | **Constraints**         | **Description**                                                                 |
|-----------------|--------------------------|-------------------------|---------------------------------------------------------------------------------|
| `id`            | `SERIAL`                 | `PRIMARY KEY`           | The unique identifier for each user (auto-incremented).                         |
| `name`          | `VARCHAR(255)`            | `NOT NULL`              | The name of the user.                                                           |
| `email`         | `VARCHAR(255)`            | `UNIQUE`, `NOT NULL`    | The email of the user (must be unique).                                          |
| `password`      | `VARCHAR(255)`            | `NOT NULL`              | The password of the user (hashed value).                                         |
| `role`          | `VARCHAR(50)`             | `DEFAULT 'user'`        | The role of the user (default is "user").                                        |
| `created_at`    | `TIMESTAMP`               | `DEFAULT CURRENT_TIMESTAMP` | The timestamp when the user was created.                                          |

---

### Operations on `users`

| **Function Name**        | **Description**                                                                                   | **Return**                                      |
|--------------------------|---------------------------------------------------------------------------------------------------|------------------------------------------------|
| `create()`               | Creates a new user and inserts their data into the `users` table (after hashing the password).     | Returns the ID of the newly created user.      |
| `getAll()`               | Retrieves all users from the `users` table.                                                       | Returns a list of all users.                   |
| `getById(id)`            | Retrieves a specific user from the `users` table by their unique ID.                              | Returns the user object for the given ID.      |
| `comparePassword()`      | Compares a plain password with the hashed password stored in the database.                        | Returns a boolean indicating whether the passwords match. |
| `initTable()`            | Initializes (creates) the `users` table if it does not already exist.                             | No return value, logs status of table creation. |
| `findByEmail(email)`     | Retrieves a user from the `users` table by their email address.                                  | Returns the user object for the given email.   |
| `update(id, data)`       | Updates the details of a specific user identified by their ID in the `users` table.               | Returns a boolean indicating whether the update was successful. |
| `delete(id)`             | Deletes a user from the `users` table based on their ID.                                          | Returns a boolean indicating whether the deletion was successful. |

---
---
 ---
---

 
# 🎯  2. **Database Design for Dishes**

| Column Name   | Data Type    | Constraints           | Description                             |
|---------------|--------------|-----------------------|-----------------------------------------|
| `id`          | `SERIAL`     | `PRIMARY KEY`         | Unique identifier for the dish          |
| `name`        | `VARCHAR(255)`| `NOT NULL`            | Name of the dish                        |
| `description` | `TEXT`       | `NOT NULL`            | Description of the dish                 |
| `price`       | `DECIMAL(10,2)`| `NOT NULL`           | Price of the dish                       |
| `image_path`  | `VARCHAR(255)`| `NOT NULL`            | Path to the image of the dish           |
| `created_at`  | `TIMESTAMP`  | `DEFAULT NOW()`       | Date the dish was added                 |

### 2. **Operations on Dishes**

| Function Name      | Description                                           | Return                     |
|--------------------|-------------------------------------------------------|----------------------------|
| `getAll`           | Fetch all dishes along with their categories and ratings | List of dishes            |
| `getById`          | Fetch details of a specific dish along with ratings and comments | Specific dish with details |
| `create`           | Create a new dish                                       | ID of the new dish         |
| `update`           | Update details of an existing dish                     | Number of affected rows    |
| `delete`           | Delete a dish by its ID                                | Number of affected rows    |
| `linkCategory`     | Link a dish to a category                             | Number of affected rows    |

### 3. **Entity-Relationship Summary**

- **Dish** (1) → (M) **Review**: A dish can have multiple reviews.
- **Dish** (M) → (M) **Category**: A dish can be linked to multiple categories, and categories can have multiple dishes (many-to-many relationship).

 
 ---
 ---
 ---
 ---
 ---
 ---
 
# 🎈 3. **Database Design for Reviews**

| Column Name   | Data Type    | Constraints           | Description                             |
|---------------|--------------|-----------------------|-----------------------------------------|
| `id`          | `SERIAL`     | `PRIMARY KEY`         | Unique identifier for the review        |
| `user_id`     | `INTEGER`    | `NOT NULL, FOREIGN KEY` | ID of the user who made the review      |
| `dish_id`     | `INTEGER`    | `NOT NULL, FOREIGN KEY` | ID of the dish being reviewed           |
| `rating`      | `INTEGER`    | `NOT NULL`            | Rating given to the dish                |
| `comment`     | `TEXT`       | `NULL`                | The comment made by the user            |
| `created_at`  | `TIMESTAMP`  | `DEFAULT NOW()`       | Date when the review was created        |

### 2. **Operations on Reviews**

| Function Name    | Description                                           | Return                     |
|------------------|-------------------------------------------------------|----------------------------|
| `create`         | Create a new review for a dish                        | Review object with ID, user_id, dish_id, rating, comment |
| `getByDishId`    | Fetch all reviews for a specific dish along with the user's name | List of reviews for a dish |

### 3. **Entity-Relationship Summary**

- **Review** (M) → (1) **User**: A review is created by one user, but a user can create multiple reviews.
- **Review** (M) → (1) **Dish**: A review is for a specific dish, but a dish can have multiple reviews (many-to-one relationship).

 ---
 ---
 ---
 ---
 
#  🎯 4 . **Database Design for DishCategories**

| Column Name   | Data Type    | Constraints           | Description                             |
|---------------|--------------|-----------------------|-----------------------------------------|
| `id`          | `SERIAL`     | `PRIMARY KEY`         | Unique identifier for the dish-category link |
| `dish_id`     | `INTEGER`    | `NOT NULL, FOREIGN KEY` | ID of the dish in the relationship      |
| `category_id` | `INTEGER`    | `NOT NULL, FOREIGN KEY` | ID of the category in the relationship  |

### 2. **Operations on DishCategories**

| Function Name    | Description                                           | Return                     |
|------------------|-------------------------------------------------------|----------------------------|
| `create`         | Create a new link between a dish and a category       | ID of the new dish-category link |

### 3. **Entity-Relationship Summary**

- **DishCategory** (M) → (1) **Dish**: A dish can belong to multiple categories (many-to-many relationship).
- **DishCategory** (M) → (1) **Category**: A category can contain multiple dishes (many-to-many relationship).

 ---
 ---
 ---
 ---
 ---
 
# 🎯 5. **Database Design for Categories**

| Column Name   | Data Type    | Constraints           | Description                             |
|---------------|--------------|-----------------------|-----------------------------------------|
| `id`          | `SERIAL`     | `PRIMARY KEY`         | Unique identifier for the category      |
| `name`        | `VARCHAR`    | `NOT NULL`            | Name of the category                    |
| `description` | `TEXT`       | `NULL`                | Description of the category             |

### 2. **Operations on Categories**

| Function Name    | Description                                         | Return                                     |
|------------------|-----------------------------------------------------|--------------------------------------------|
| `getAll`         | Fetch all categories along with the count of dishes | List of categories with `id`, `name`, `description`, and `dish_count` |
| `create`         | Create a new category                               | The newly created category's `id`, `name`, and `description` |
| `update`         | Update an existing category                         | The updated category's `id`, `name`, and `description`, or `null` if not found |
| `delete`         | Delete a category                                   | `true` if the category was successfully deleted, or `null` if not found |

### 3. **Entity-Relationship Summary**

- **Category** (1) → (M) **DishCategory**: A category can be linked to multiple dishes (one-to-many relationship).
- **DishCategory** (M) → (1) **Dish**: A dish can belong to multiple categories (many-to-many relationship).

---
---
---
---
# 6