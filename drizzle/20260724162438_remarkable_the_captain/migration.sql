CREATE TABLE `appointments` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`public_id` text NOT NULL UNIQUE,
	`agent_id` integer NOT NULL,
	`therapy_id` integer NOT NULL,
	`ailment_id` integer NOT NULL,
	`slot_id` integer NOT NULL,
	`status` text DEFAULT 'booked' NOT NULL,
	CONSTRAINT `fk_appointments_agent_id_agents_id_fk` FOREIGN KEY (`agent_id`) REFERENCES `agents`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_appointments_therapy_id_therapies_id_fk` FOREIGN KEY (`therapy_id`) REFERENCES `therapies`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_appointments_ailment_id_ailments_id_fk` FOREIGN KEY (`ailment_id`) REFERENCES `ailments`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_appointments_slot_id_time_slots_id_fk` FOREIGN KEY (`slot_id`) REFERENCES `time_slots`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `time_slots` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`therapy_id` integer NOT NULL,
	`starts_at` integer NOT NULL,
	CONSTRAINT `fk_time_slots_therapy_id_therapies_id_fk` FOREIGN KEY (`therapy_id`) REFERENCES `therapies`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE UNIQUE INDEX `active_appointment_per_slot` ON `appointments` (`slot_id`) WHERE "appointments"."status" = 'booked';