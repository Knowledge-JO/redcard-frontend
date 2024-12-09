import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectItems from "@/components/ui/SelectItems";
import {
  HiGiftTop,
  HiPhoto,
  HiOutlineChevronRight,
  HiUserGroup,
} from "react-icons/hi2";

export default function Home() {
  return (
    <div className="">
      <div className="bg-gray-200 text-stone-500 px-3 py-3">
        Send red envelops
      </div>

      <div className="px-3 mt-5 ">
        <form className="">
          <div className="bg-gray-200 rounded-xl py-2 px-2 flex items-center justify-between">
            <Select defaultValue="usdt">
              <SelectTrigger className="w-[90px] border-none text-stone-700 text-xs focus:ring-0 px-0 shadow-none">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>currencies</SelectLabel>
                  <SelectItems />
                </SelectGroup>
              </SelectContent>
            </Select>

            <input
              type="number"
              min={0}
              required
              className="bg-transparent text-right px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl focus:ring-offset-2"
              placeholder="Enter amount"
            />
          </div>

          <div className="bg-gray-200 rounded-xl py-3 px-2 flex items-center justify-between mt-4 text-xs text-stone-700">
            <div className="flex items-center gap-2">
              <HiGiftTop className="text-red-600 text-2xl" />
              <p>Number of tickets</p>
            </div>

            <input
              type="number"
              className="bg-transparent text-right px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl focus:ring-offset-2"
              placeholder="type amount of tickets"
            />
          </div>

          <div className="bg-gray-200 rounded-xl py-3 px-2 flex items-center justify-between mt-4 text-xs text-stone-700">
            <div className="flex items-center gap-2">
              <HiPhoto className="text-red-600 text-2xl" />
              <p>Red envelop cover</p>
            </div>

            <div className="flex items-center gap-2">
              <p>Pick cover</p>
              <HiOutlineChevronRight />
            </div>
          </div>

          <div className="bg-gray-200 rounded-xl py-3 px-2 flex items-center justify-between mt-4 text-xs text-stone-700">
            <div className="flex items-center gap-2">
              <HiUserGroup className="text-yellow-500 text-2xl" />
              <p>Telegram channel</p>
            </div>

            <HiOutlineChevronRight />
          </div>

          <textarea
            placeholder="Type message"
            className="mt-4 ring-2 ring-blue-500 px-2 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl focus:ring-offset-2"
          />

          <Button className="w-full bg-orange-500 rounded-xl mt-5">
            Release
          </Button>
        </form>
      </div>
    </div>
  );
}
