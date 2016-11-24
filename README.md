# Bamazon

The following npm modules were used: `mysql`,  `cli-table`, and `inquirer`.

Link to video: https://www.youtube.com/watch?v=o2O2LDkEVTc

 Customer View

In a MySQL Database called Bamazon, a table inside of that database called Products has following columns:
* ItemID (unique id for each product)

* ProductName (Name of product)

* DepartmentName 

* Price (cost to customer)

* StockQuantity (how much of the product is available in stores)

A Node application called BamazonCustomer.js. displays all of the items available for sale, including the ids, names, and prices of products for sale.
The app then prompts users with two messages:
It asks them the ID of the product they would like to buy and how many units of the product they would like to buy.
Once the customer has placed the order, the application  checks if the store has enough of the product to meet the customer's request.
If not, the app says that quantity is not in stock, how much is in stock, and offers the chance to buy the quantity of stock on hand.
If the store does have enough of the product, the customer's order is processed.
The SQL database is then updated to reflect the remaining quantity.
Once the update goes through, the customer is shown the total cost of their purchase with tax.
When a customer purchases anything from the store, the program calculates the total sales from each transaction.

Another Node application called BamazonManager.js.lists the following set of menu options:
View Products for Sale
View Low Inventory
Add to Inventory
Add New Product

If a manager selects View Products for Sale, the app lists every available item: the item IDs, names, prices, and quantities.
If a manager selects View Low Inventory, then it lists all items with a inventory count lower than five.
If a manager selects Add to Inventory, a prompt is displayed that will let the manager "add more" of any item currently in the store.
If a manager selects Add New Product, it allows the manager to add a completely new product to the store.

In a MySQL table called Departments a table includes the following columns:
* DepartmentID

* DepartmentName

* OverHeadCosts (A dummy number you set for each department)

* TotalSales

The revenue from each transaction is added to the TotalSales column for the related department and updates the inventory listed in the Products column.

A Node app called BamazonExecutive.js. gives this set of menu options:
View Product Sales by Department
Create New Department
When an executive selects View Product Sales by Department, a summarized table is displayed.
DepartmentID  DepartmentName  OverHeadCosts ProductSales  TotalProfit

The TotalProfit is calculated on the fly using the difference between OverheadCosts and ProductSales. TotalProfit is not be stored in any database.
