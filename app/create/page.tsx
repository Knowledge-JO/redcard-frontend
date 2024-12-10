import RedForm from "@/components/ui/RedForm";
import { getChecks } from "@/lib/cryptoApi";

async function Page() {
  console.log(await getChecks());
  return (
    <div>
      <RedForm />
    </div>
  );
}

export default Page;
