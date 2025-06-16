📚 Database Design Documentation
This document outlines the database schema for a system managing users, dishes, orders, reviews, categories, coupons, and promotions. Each table includes its structure, operations, and entity-relationship details.

1. Database Design for users
Table Structure



Column Name
Data Type
Constraints
Description



id
SERIAL
PRIMARY KEY
The unique identifier for each user (auto-incremented).


name
VARCHAR(255)
NOT NULL
The name of the user.


email
VARCHAR(255)
UNIQUE, NOT NULL
The email of the user (must be unique).


password
VARCHAR(255)
NOT NULL
The password of the user (hashed value).


role
VARCHAR(50)
DEFAULT 'user'
The role of the user (default is "user").


created_at
TIMESTAMP
DEFAULT CURRENT_TIMESTAMP
The timestamp when the user was created.


Operations



Function Name
Description
Return



create()
Creates a new user and inserts their data into the users table (after hashing the password).
Returns the ID of the newly created user.


getAll()
Retrieves all users from the users table.
Returns a list of all users.


getById(id)
Retrieves a specific user from the users table by their unique ID.
Returns the user object for the given ID.


comparePassword()
Compares a plain password with the hashed password stored in the database.
Returns a boolean indicating whether the passwords match.


initTable()
Initializes (creates) the users table if it does not already exist.
No return value, logs status of table creation.


findByEmail(email)
Retrieves a user from the users table by their email address.
Returns the user object for the given email.


update(id, data)
Updates the details of a specific user identified by their ID in the users table.
Returns a boolean indicating whether the update was successful.


delete(id)
Deletes a user from the users table based on their ID.
Returns a boolean indicating whether the deletion was successful.



2. Database Design for dishes
Table Structure



Column Name
Data Type
Constraints
Description



id
SERIAL
PRIMARY KEY
Unique identifier for the dish


name
VARCHAR(255)
NOT NULL
Name of the dish


description
TEXT
NOT NULL
Description of the dish


price
DECIMAL(10,2)
NOT NULL
Price of the dish


image_path
VARCHAR(255)
NOT NULL
Path to the image of the dish


created_at
TIMESTAMP
DEFAULT NOW()
Date the dish was added


Operations



Function Name
Description
Return



getAll
Fetch all dishes along with their categories and ratings
List of dishes


getById
Fetch details of a specific dish along with ratings and comments
Specific dish with details


create
Create a new dish
ID of the new dish


update
Update details of an existing dish
Number of affected rows


delete
Delete a dish by its ID
Number of affected rows


linkCategory
Link a dish to a category
Number of affected rows



3. Database Design for categories
Table Structure



Column Name
Data Type
Constraints
Description



id
SERIAL
PRIMARY KEY
Unique identifier for the category


name
VARCHAR
NOT NULL
Name of the category


description
TEXT
NULL
Description of the category


Operations



Function Name
Description
Return



getAll
Fetch all categories along with the count of dishes
List of categories with id, name, description, and dish_count


create
Create a new category
The newly created category's id, name, and description


update
Update an existing category
The updated category's id, name, and description, or null if not found


delete
Delete a category
true if the category was successfully deleted, or null if not found



4. Database Design for dish_categories
Table Structure



Column Name
Data Type
Constraints
Description



id
SERIAL
PRIMARY KEY
Unique identifier for the dish-category link


dish_id
INTEGER
NOT NULL, FOREIGN KEY
ID of the dish in the relationship


category_id
INTEGER
NOT NULL, FOREIGN KEY
ID of the category in the relationship


Operations



Function Name
Description
Return



create
Create a new link between a dish and a category
ID of the new dish-category link



5. Database Design for reviews
Table Structure



Column Name
Data Type
Constraints
Description



id
SERIAL
PRIMARY KEY
Unique identifier for the review


user_id
INTEGER
NOT NULL, FOREIGN KEY
ID of the user who made the review


dish_id
INTEGER
NOT NULL, FOREIGN KEY
ID of the dish being reviewed


rating
INTEGER
NOT NULL
Rating given to the dish


comment
TEXT
NULL
The comment made by the user


created_at
TIMESTAMP
DEFAULT NOW()
Date when the review was created


Operations



Function Name
Description
Return



create
Create a new review for a dish
Review object with ID, user_id, dish_id, rating, comment


getByDishId
Fetch all reviews for a specific dish along with the user's name
List of reviews for a dish



6. Database Design for orders
Table Structure



Column Name
Data Type
Constraints
Description



id
INTEGER
PRIMARY KEY, SERIAL
Unique ID for the order


user_id
INTEGER
FOREIGN KEY (users.id)
The user who placed the order


status
TEXT
NOT NULL
Status of the order (e.g., pending, paid)


created_at
TIMESTAMP
DEFAULT now()
Timestamp when the order was created


updated_at
TIMESTAMP
DEFAULT now()
Timestamp when the order was last updated


Related Tables

order_dishes
coupon_uses

Operations



Function Name
Description
Return



getAllOrdersWithDishes
Returns all orders with their dishes and quantities
Array of orders with dishes


getAll
Returns all orders (grouped), with dish names and quantities aggregated
Array of grouped orders


getById(id)
Returns full details of a specific order (user, dishes, promo, coupon)
Order object


getMyOrders(userId)
Returns orders made by a specific user
Array of grouped orders


create({ user_id, status })
Creates a new order with user_id and status
{ id, user_id, status }


update(id, status)
Updates the status of an order
Boolean


delete(id)
Deletes an order by ID
Boolean



7. Database Design for coupons
Table Structure



Column Name
Data Type
Constraints
Description



id
INT
PRIMARY KEY
Unique identifier for the coupon.


code
VARCHAR(50)
UNIQUE, NOT NULL
The unique code for the coupon.


discount_type
VARCHAR(20)
NOT NULL
The type of discount (e.g., fixed, percentage).


discount_value
DECIMAL(10,2)
NOT NULL
The value of the discount.


min_order
DECIMAL(10,2)
NOT NULL
The minimum order amount required for the coupon to be used.


start_date
DATETIME
NOT NULL
The date the coupon becomes valid.


end_date
DATETIME
NOT NULL
The date the coupon expires.


max_uses
INT
NOT NULL
The maximum number of times the coupon can be used.


current_uses
INT
DEFAULT 0
The current number of uses for the coupon.


is_active
BOOLEAN
DEFAULT TRUE
Indicates if the coupon is active or not.


user_max_uses
INT
NOT NULL
The maximum number of times a user can use the coupon.


Operations



Function Name
Description
Return



createCoupon
Creates a new coupon in the database.
Result of the insert operation.


getCoupons
Retrieves all coupons or a specific coupon by code.
The ID of the coupon (or null if not found).


getCouponsByFilter
Retrieves all active coupons, optionally filtered by code.
List of coupons matching the filter.


getCouponById
Retrieves a coupon by its ID.
The coupon object or null if not found.


updateCoupon
Updates an existing coupon based on its ID.
Result of the update operation.


deleteCoupon
Deletes a coupon based on its ID.
Result of the delete operation.


getCouponUses
Retrieves the total number of times a coupon has been used.
Number of uses (integer).


getUserCouponUses
Retrieves the total number of times a specific user has used a coupon.
Number of uses by the user.


addCouponToOrder
Adds a coupon usage record to the coupon_uses table.
Result of the insert operation.


applyCouponToOrder
Applies a coupon to an order and updates usage counts.
Success message or error.


getCouponByCode
Retrieves a coupon by its code, checking if it is valid for the user.
The coupon object or an error message.



8. Database Design for coupon_uses
Table Structure



Column Name
Data Type
Constraints
Description



user_id
INT
FOREIGN KEY (users.id)
Reference to the user who used the coupon


coupon_id
INT
FOREIGN KEY (coupons.id)
Reference to the coupon used


order_id
INT
FOREIGN KEY (orders.id)
Reference to the order where the coupon was applied


use_date
TIMESTAMP
DEFAULT NOW()
The date and time when the coupon was used


Operations



Function Name
Description
Return



addCouponUse
Adds a new record for a coupon usage by a user on an order
void


checkUserCouponUsage
Checks how many times a user has used a specific coupon
Integer (usage count)


checkCouponTotalUsage
Checks the total number of uses of a specific coupon
Integer (usage count)


getCouponById
Retrieves coupon details by ID if the coupon is active and valid
Object (coupon details)



9. Database Design for promotions
Table Structure



Column Name
Data Type
Constraints
Description



id
INT
PRIMARY KEY
Unique identifier for the promotion


dish_id
INT
NOT NULL
Foreign key referencing the dish associated with the promotion


discount_percentage
DECIMAL(5,2)
NOT NULL
Percentage discount applied to the dish


start_date
DATETIME
NOT NULL
Start date of the promotion


end_date
DATETIME
NOT NULL
End date of the promotion


is_active
BOOLEAN
NOT NULL
Flag to indicate if the promotion is active


Operations



Function Name
Description
Return



findAllActive
Fetches all active promotions within the valid date range.
Array of active promotions


findById
Fetches a promotion by its ID.
A single promotion object


create
Creates a new promotion with the provided data.
The newly created promotion


update
Updates an existing promotion with new data (dish_id, discount_percentage, start_date, end_date, is_active).
The updated promotion object


toggleStatus
Toggles the status (active/inactive) of a promotion based on its current status.
The updated promotion object


delete
Deletes a promotion based on its ID.
true (if deleted successfully)


getDishesWithPromotions
Retrieves all dishes that have active promotions.
Array of dishes with promotions



10. Entity-Relationship Summary
Relationships

users ⟶ orders: 1:MEach user can create multiple orders.


orders ⟶ order_dishes: 1:MEach order contains multiple dishes.


dishes ⟶ order_dishes: 1:MEach dish can appear in multiple orders.


orders ⟶ coupon_uses: 1:1 (or 0:1)An order can use at most one coupon, or none.


coupons ⟶ coupon_uses: 1:MA single coupon can be used in multiple orders.


dishes ⟶ promotions: 1:MA single dish can have multiple promotions over time.


dish (1) → (M) reviewA dish can have multiple reviews.


dish (M) → (M) categoryA dish can be linked to multiple categories, and categories can have multiple dishes (many-to-many relationship).


review (M) → (1) userA review is created by one user, but a user can create multiple reviews.


review (M) → (1) dishA review is for a specific dish, but a dish can have multiple reviews (many-to-one relationship).


dish_category (M) → (1) dishA dish can belong to multiple categories (many-to-many relationship).


dish_category (M) → (1) categoryA category can contain multiple dishes (many-to-many relationship).


category (1) → (M) dish_categoryA category can be linked to multiple dishes (one-to-many relationship).


coupon_uses (M:1) usersEach coupon use is related to a specific user, but a user can use multiple coupons.


coupon_uses (M:1) couponsEach coupon use is tied to a single coupon, but a coupon can be used multiple times.


coupon_uses (M:1) ordersEach coupon use is associated with a specific order, but an order can be linked to multiple coupon uses.


promotions (1:M) dishesA promotion can be associated with multiple dishes (each dish may have multiple promotions over time, but only one active promotion at a time).


promotions (M:1) dish_idA promotion references a specific dish through the dish_id foreign key.

 
