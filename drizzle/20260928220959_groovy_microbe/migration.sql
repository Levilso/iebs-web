CREATE TABLE `event_entry` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`info` text NOT NULL,
	`date` text NOT NULL,
	`hidden` integer DEFAULT false NOT NULL,
	`location` text NOT NULL,
	`price` real NOT NULL,
	`coverImage` text DEFAULT 'https://res.cloudinary.com/iebs-cloudinary/image/upload/q_auto/f_auto/v1778772122/iebs/events/hrm0nupg3xntmge7oo3j.jpg' NOT NULL,
	`capacity` integer,
	`category` text
);
--> statement-breakpoint
CREATE TABLE `registration` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`eventId` integer NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`num` integer NOT NULL,
	`createdAt` text NOT NULL,
	CONSTRAINT `fk_registration_eventId_event_entry_id_fk` FOREIGN KEY (`eventId`) REFERENCES `event_entry`(`id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_email_per_event` ON `registration` (`eventId`,`email`);