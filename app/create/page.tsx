import RedForm from "@/components/ui/RedForm";
import SecondaryNav from "@/components/ui/SecondaryNav";

function page() {
  return (
    <div className=" max-w-lg mx-auto">
      <SecondaryNav to="/">
        <p>Create red cards</p>
      </SecondaryNav>

      <RedForm />
    </div>
  );
}

export default page;
