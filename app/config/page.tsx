import SecondaryNav from "@/components/ui/SecondaryNav";
import TelegramChats from "@/components/ui/TelegramChats";

function page() {
  return (
    <div className="max-w-lg mx-auto">
      <SecondaryNav to="/">Chats</SecondaryNav>

      <TelegramChats />
    </div>
  );
}

export default page;
