DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roomId` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `date` varchar(255) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  PRIMARY KEY (`id`)
);
