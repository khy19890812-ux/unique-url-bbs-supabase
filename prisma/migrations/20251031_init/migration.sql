-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT,
    "imageUrl" TEXT,
    "author" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "author" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "postId" INTEGER NOT NULL REFERENCES "Post"("id") ON DELETE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- Trigger to auto-update updatedAt
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_post_updated_at
BEFORE UPDATE ON "Post"
FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
