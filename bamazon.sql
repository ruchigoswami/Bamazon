CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity  INTEGER(10),
    primary key (item_id)
);

INSERT INTO products(product_name,department_name,price,stock_quantity) VALUES('sugar','grocery',3.99,60),('bars','grocery',4.99,160),
('paw-petrol','books',3,20),('dress','clothes',10.99,6),('cereal','grocery',5.99,100),('drinks','grocery',1.99,160),
('baby-food','baby',6.99,40),('pasta','grocery',3.99,40),('snacks','grocery',3.99,600),('almonds','grocery',3.99,50);

show tables from bamazon;

select * from products;