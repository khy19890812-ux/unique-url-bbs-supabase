// app/new/page.tsx
import NewPostForm from "./_NewPostForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NewPage() {
  return <NewPostForm />;
}
