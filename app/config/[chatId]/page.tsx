import CollapsibleForms from "@/components/ui/CollapsibleForms";

function page({ params }: { params: { chatId: string } }) {
  return (
    <div className="max-w-lg mx-auto">
      <CollapsibleForms chatId={params.chatId} />
    </div>
  );
}

export default page;
