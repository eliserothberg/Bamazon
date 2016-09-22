# Bamazon

The following npm modules were used: `mysql`,  `cli-table`, and `inquirer`.

Link to video: https://www.youtube.com/watch?v=VCtERk7q7Tk&feature=youtu.be

Two small updates post-video: 

![alt text](screenshots/inventoryNaNspace.png "Description goes here")
![alt text](screenshots/deptAddCommas.png "Description goes here")

[[https://github.com/eliserothberg/Bamazon/blob/master/img/inventoryNaNspace.png|alt= space after NaN inventory add]]

[[https://github.com/eliserothberg/Bamazon/blob/master/img/deptAddCommas.png|alt= added dept add commas in $ amts]]


```
What would you like to do?
Add A New Department? 
What is the name of the department you would like to add? Games
What are the overhead costs? 250755.55
 What are the total sales? 1235775.75
 ```
 will now return:
 ```
 Your department Games with overhead costs of $250,755.55 and total sales of $1,235,775.75 was successfully added.
```
And added a line break so the following is spaced as such:
```
To add inventory, choose the items's ID # 16
How many items are you adding? e

Sorry, that was not a number.
```
