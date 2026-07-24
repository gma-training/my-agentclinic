CREATE TABLE `ailments` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`slug` text NOT NULL UNIQUE,
	`name` text NOT NULL,
	`short_description` text NOT NULL,
	`severity` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `symptoms` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`ailment_id` integer NOT NULL,
	`label` text NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	CONSTRAINT `fk_symptoms_ailment_id_ailments_id_fk` FOREIGN KEY (`ailment_id`) REFERENCES `ailments`(`id`) ON DELETE CASCADE
);
