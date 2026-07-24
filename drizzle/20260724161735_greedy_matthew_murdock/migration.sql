CREATE TABLE `ailment_therapies` (
	`ailment_id` integer NOT NULL,
	`therapy_id` integer NOT NULL,
	CONSTRAINT `ailment_therapies_pk` PRIMARY KEY(`ailment_id`, `therapy_id`),
	CONSTRAINT `fk_ailment_therapies_ailment_id_ailments_id_fk` FOREIGN KEY (`ailment_id`) REFERENCES `ailments`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_ailment_therapies_therapy_id_therapies_id_fk` FOREIGN KEY (`therapy_id`) REFERENCES `therapies`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `therapies` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`slug` text NOT NULL UNIQUE,
	`name` text NOT NULL,
	`short_description` text NOT NULL,
	`duration_minutes` integer NOT NULL
);
