CREATE TABLE `event_entry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
CREATE TABLE `invitation_token` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `registration` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`eventId` integer NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`num` integer NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`eventId`) REFERENCES `event_entry`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_email_per_event` ON `registration` (`eventId`,`email`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'miembro' NOT NULL,
	`password_hash` text,
	`status` text DEFAULT 'pending_password' NOT NULL,
	`created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);