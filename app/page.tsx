import Home from "@/components/ui/Home";
import { getChecks } from "@/lib/cryptoApi";

async function Page() {
  const checks = await getChecks();

  console.log(checks);
  return (
    <div>
      <Home checks={checks} />
    </div>
  );
}

export default Page;
