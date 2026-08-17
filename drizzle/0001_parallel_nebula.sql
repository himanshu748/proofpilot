CREATE TABLE `auditEvents` (
	`id` varchar(36) NOT NULL,
	`documentId` varchar(36) NOT NULL,
	`actorId` int,
	`eventType` varchar(96) NOT NULL,
	`message` text NOT NULL,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `auditEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` varchar(36) NOT NULL,
	`ownerId` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`storageUrl` varchar(768) NOT NULL,
	`contentType` varchar(128) NOT NULL DEFAULT 'application/pdf',
	`status` enum('pending review','approved','rejected') NOT NULL DEFAULT 'pending review',
	`confidenceScore` decimal(5,4) NOT NULL DEFAULT '0.0000',
	`extractionProvider` varchar(64) NOT NULL DEFAULT 'Nutrient DWS',
	`extractionRequestId` varchar(128),
	`signedStorageKey` varchar(512),
	`signedStorageUrl` varchar(768),
	`signingRequestId` varchar(128),
	`finalizedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `extractedFields` (
	`id` varchar(36) NOT NULL,
	`documentId` varchar(36) NOT NULL,
	`fieldKey` varchar(128) NOT NULL,
	`label` varchar(160) NOT NULL,
	`value` text NOT NULL,
	`confidence` decimal(5,4) NOT NULL,
	`sourcePage` int,
	`sourceBounds` text,
	`sourceCitation` text,
	`requiresReview` boolean NOT NULL DEFAULT false,
	`editedByHuman` boolean NOT NULL DEFAULT false,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `extractedFields_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `publicShares` (
	`id` varchar(36) NOT NULL,
	`documentId` varchar(36) NOT NULL,
	`slug` varchar(96) NOT NULL,
	`isPublic` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `publicShares_id` PRIMARY KEY(`id`),
	CONSTRAINT `publicShares_slug_unique` UNIQUE(`slug`)
);
