CREATE TABLE IF NOT EXISTS `mdt_tutanaklar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text CHARACTER SET utf8 COLLATE utf8_turkish_ci NOT NULL,
  `suclular` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `polisler` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `cezalar` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;

ALTER TABLE `users`
	ADD COLUMN `mdt_img` text DEFAULT NULL,,
	ADD COLUMN `araniyor` int(11) NOT NULL DEFAULT 1
;

