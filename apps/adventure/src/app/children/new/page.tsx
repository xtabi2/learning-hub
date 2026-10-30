import { ChildForm } from "@/components/ChildForm";
import { Disclaimer } from "@/components/Disclaimer";
import { requireUser } from "@/lib/auth";

export default async function NewChildPage() {
  await requireUser();
  return (
    <div className="space-y-6">
      <ChildForm />
      <Disclaimer compact />
    </div>
  );
}
