cd c:\xampp\mysql\bin
mysql.exe -u root --password


 show variables like 'character_set_database';
 set character_set_database = utf8mb4;

 CREATE USER 'usuarioteste'@'localhost' IDENTIFIED BY '12345';
 GRANT ALL PRIVILEGES ON * . * TO 'usuarioteste'@'localhost';
 FLUSH PRIVILEGES;

