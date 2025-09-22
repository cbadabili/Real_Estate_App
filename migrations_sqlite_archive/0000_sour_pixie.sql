CREATE TABLE `admin_audit_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`admin_id` integer NOT NULL,
	`action` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` integer NOT NULL,
	`details` text,
	`ip_address` text,
	`user_agent` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `agent_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`agent_id` integer NOT NULL,
	`reviewer_id` integer NOT NULL,
	`rating` integer NOT NULL,
	`review` text,
	`transaction_type` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`agent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`buyer_id` integer NOT NULL,
	`agent_id` integer,
	`appointment_date` integer NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`agent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`buyer_id` integer NOT NULL,
	`message` text NOT NULL,
	`status` text DEFAULT 'unread' NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`buyer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lease_agreements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`application_id` integer,
	`rental_id` integer,
	`landlord_id` integer,
	`renter_id` integer,
	`lease_start_date` text NOT NULL,
	`lease_end_date` text NOT NULL,
	`monthly_rent` integer NOT NULL,
	`deposit_amount` integer NOT NULL,
	`lease_terms` text,
	`landlord_signature_status` text DEFAULT 'pending',
	`renter_signature_status` text DEFAULT 'pending',
	`e_signature_status` text DEFAULT 'pending',
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`application_id`) REFERENCES `rental_applications`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`rental_id`) REFERENCES `rental_listings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`landlord_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`renter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`price` text NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`zip_code` text NOT NULL,
	`latitude` text,
	`longitude` text,
	`property_type` text NOT NULL,
	`listing_type` text NOT NULL,
	`bedrooms` integer,
	`bathrooms` text,
	`square_feet` integer,
	`area_build` integer,
	`lot_size` text,
	`year_built` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`images` text,
	`features` text,
	`virtual_tour_url` text,
	`video_url` text,
	`property_taxes` text,
	`hoa_fees` text,
	`owner_id` integer,
	`agent_id` integer,
	`views` integer DEFAULT 0,
	`days_on_market` integer DEFAULT 0,
	`auction_date` integer,
	`auction_time` text,
	`starting_bid` text,
	`current_bid` text,
	`reserve_price` text,
	`auction_house` text,
	`auctioneer_name` text,
	`auctioneer_contact` text,
	`bid_increment` text,
	`deposit_required` text,
	`auction_terms` text,
	`lot_number` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`agent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `property_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`reviewer_id` integer NOT NULL,
	`rating` integer NOT NULL,
	`review` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `rental_applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rental_id` integer,
	`renter_id` integer,
	`application_data` text NOT NULL,
	`status` text DEFAULT 'pending',
	`background_check_status` text DEFAULT 'pending',
	`credit_report_status` text DEFAULT 'pending',
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`rental_id`) REFERENCES `rental_listings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`renter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `rental_listings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`landlord_id` integer,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`district` text NOT NULL,
	`ward` text,
	`property_type` text NOT NULL,
	`bedrooms` integer NOT NULL,
	`bathrooms` integer NOT NULL,
	`square_meters` integer NOT NULL,
	`monthly_rent` integer NOT NULL,
	`deposit_amount` integer NOT NULL,
	`lease_duration` integer NOT NULL,
	`available_from` text NOT NULL,
	`furnished` integer DEFAULT false,
	`pets_allowed` integer DEFAULT false,
	`parking_spaces` integer DEFAULT 0,
	`photos` text DEFAULT '[]',
	`amenities` text DEFAULT '[]',
	`utilities_included` text DEFAULT '[]',
	`status` text DEFAULT 'active',
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`landlord_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `review_helpful` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`review_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`is_helpful` integer NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`review_id`) REFERENCES `user_reviews`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `review_responses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`review_id` integer NOT NULL,
	`responder_id` integer NOT NULL,
	`response` text NOT NULL,
	`is_official` integer DEFAULT false,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`review_id`) REFERENCES `user_reviews`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`responder_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `saved_properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`property_id` integer NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `saved_searches` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`search_criteria` text,
	`name` text,
	`email_alerts` integer DEFAULT false,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_permissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`permission` text NOT NULL,
	`granted_by` integer,
	`expires_at` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`granted_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reviewee_id` integer NOT NULL,
	`reviewer_id` integer NOT NULL,
	`rating` integer NOT NULL,
	`review` text,
	`review_type` text NOT NULL,
	`transaction_id` integer,
	`is_verified` integer DEFAULT false,
	`is_public` integer DEFAULT true,
	`status` text DEFAULT 'active' NOT NULL,
	`moderator_notes` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`reviewee_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`phone` text,
	`user_type` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`permissions` text,
	`avatar` text,
	`bio` text,
	`is_verified` integer DEFAULT false,
	`is_active` integer DEFAULT true,
	`reac_number` text,
	`last_login_at` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `service_ads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider_id` integer,
	`ad_title` text NOT NULL,
	`ad_copy` text,
	`ad_image_url` text,
	`target_audience` text NOT NULL,
	`context_trigger` text NOT NULL,
	`cta_text` text DEFAULT 'Learn More',
	`cta_url` text,
	`active` integer DEFAULT true,
	`priority` integer DEFAULT 1,
	`impressions` integer DEFAULT 0,
	`clicks` integer DEFAULT 0,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`provider_id`) REFERENCES `service_providers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `service_providers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_name` text NOT NULL,
	`service_category` text NOT NULL,
	`contact_person` text,
	`phone_number` text,
	`email` text,
	`website_url` text,
	`logo_url` text,
	`description` text,
	`reac_certified` integer DEFAULT false,
	`address` text,
	`city` text,
	`rating` text DEFAULT '4.5',
	`review_count` integer DEFAULT 0,
	`verified` integer DEFAULT false,
	`featured` integer DEFAULT false,
	`date_joined` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `service_providers_email_unique` ON `service_providers` (`email`);--> statement-breakpoint
CREATE TABLE `service_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider_id` integer,
	`user_id` integer,
	`rating` integer NOT NULL,
	`review` text,
	`reviewer_name` text,
	`reviewer_avatar` text,
	`verified` integer DEFAULT false,
	`helpful` integer DEFAULT 0,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`provider_id`) REFERENCES `service_providers`(`id`) ON UPDATE no action ON DELETE no action
);
