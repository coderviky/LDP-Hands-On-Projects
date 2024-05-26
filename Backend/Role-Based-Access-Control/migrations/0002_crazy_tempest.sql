CREATE TABLE IF NOT EXISTS "post" (
	"postId" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"content" text NOT NULL,
	"userId" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_userId_users_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "post_title_userId_unique" ON "post" ("title","userId");