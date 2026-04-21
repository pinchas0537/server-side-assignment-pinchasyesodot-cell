# :globe_with_meridians: Midterm Server-side Assignment

Welcome to the Midterm Server-side Assignment. Here you'll have the chance to show us what you've learned so far! :muscle:

In this assignment, you'll build a store management system. The store will have items, suppliers, and orders. You'll have to manage the inventory, calculate the profit, and analyze the store's revenue. :moneybag:

What the store sells is completely up to your imagination. :thought_balloon::bulb:

The system will be a **Backend** service built using **Node.js** and **Express.js**, with **MongoDB** as the database. Later, when we learn about **React**, you'll build a frontend for the store.

## :shopping_cart: The Store

The system will store the following information:

- **Items:**
    - name
    - price
    - stock
    - category
    - supplier
- **Suppliers:**
    - name
    - items and their price
- **Orders:**
    - items and their quantity
    - address
    - order date
    - shop profit

* Assume that supplier prices are fixed and cannot be changed.

The design of the store is completely up to you. You can use as many collections as you want and have any relations you want between them. However, you must be able to manage the above information and include the features mentioned below.

## :hammer_and_wrench: Rules

- Inventory Management:
    - Each item price must be at least 30% higher than the supplier price. Our store cannot operate at a loss.
    - The stock should be automatically updated based on the orders.
    - If Item is out of stock, return an appropriate status code.

- Order Constraints:
    - Item quantity in a new order must be less than or equal to the stock in order to proceed.
    - Every order can have a maximum of 10 unique items.
    - A customer can order a maximum of 50 items in total.

- Collections Reliability:
    - If a supplier gets deleted. All the supplier items should be deleted automatically from the store items.
    - If a supplier item gets deleted. All the store items should be deleted automatically.
    - If a supplier item price changes. All the store items should be updated automatically. (The price difference should be at least 30%)
    - When supplier name changes, all the store items should be updated automatically.

- Revenue Analysis (on demand):
    - Get the monthly revenue of the store. (last 30 days)
    - Get the weekly most profitable category. (last 7 days)
    - Get the daily most profitable item. (last 24 hours)
    - Find the items with the highest and lowest profit margin. (all time)
    - Get the supplier whose items brought the most profit. (all time)
    - Get the total amount of money the shop spent on each supplier, including both past orders and the value of items currently in stock, sorted in descending order. (all time)

## :pushpin: Standards

1. Make sure you are using **typescript** correctly:
    - No `any` type.
    - No `ts-ignore`.
    - Use `interfaces` for your collections.
    - Set the correct type for every variable, parameter, and return value.
    - Use utility types when applicable.

2. Make sure that your files and folders are organized in the way we learned in class.
3. Use **Prettier** and **ESLint**.
4. Handle Errors and Exceptions correctly.
5. Keep in mind the coding standards we have learned so far.
6. Log all of your requests.
7. Validate all of your requests using **ZOD**.
8. Handle async code correctly. Especially server middleware.
9. Use **Mongoose** to interact with the database.
10. Keep your commit messages clear and descriptive.
11. Use **Environment Variables** to pass configuration to your app. **(Read about [dotenv](https://www.npmjs.com/package/dotenv) and [env-var](https://www.npmjs.com/package/env-var))**
12. Write tests for your code.
13. Remember to use **MongoDB indexes** where applicable.

## :page_with_curl: Instructions

1. Create an architecture for your store in [draw.io](https://draw.io). Include all The REST routes, collections, and relations. When you finish, get an approval from one of the instructors to proceed.
2. Implement the basic CRUD routes for all of your collections.
3. Implement the inventory management features.
4. Implement the order constraints.
5. Implement the revenue analysis features.
6. Implement search routes for every collection.

<h2 id="bonus-content">🎯 Bonus ★</h2>

**Now, supplier prices are no longer constant**. reconsider your architecture and evaluate how this impacts your server logic.
