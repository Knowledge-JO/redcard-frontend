import Packet from "@/components/ui/Packet";
import SecondaryNav from "@/components/ui/SecondaryNav";

function page({ params }: { params: { id: string } }) {
  return (
    <div className=" max-w-lg mx-auto">
      <SecondaryNav to="/">
        <p>Red packet #{params.id}</p>
      </SecondaryNav>

      <Packet id={params.id} />
    </div>
  );
}

export default page;
