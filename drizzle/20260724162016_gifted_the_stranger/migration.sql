CREATE TABLE `agents` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`slug` text NOT NULL UNIQUE,
	`name` text NOT NULL,
	`model` text NOT NULL,
	`bio` text NOT NULL
);
