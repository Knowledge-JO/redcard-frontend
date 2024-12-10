import Image from "next/image";
import { SelectItem } from "./select";

const options = [
  {
    text: "BTC",
    value: "BTC",
    image: "/btc.png",
  },
  {
    text: "TON",
    value: "TON",
    image: "/ton.png",
  },
  {
    text: "USDT",
    value: "USDT",
    image: "/usdt.png",
  },
];

function SelectItems() {
  return options.map((option) => (
    <SelectItem value={option.value} key={option.value}>
      <div className="flex items-center gap-2">
        <div className="relative w-6 h-6 rounded-full">
          <Image src={option.image} alt="" fill className="object-cover" />
        </div>
        <p>{option.text}</p>
      </div>
    </SelectItem>
  ));
}

export default SelectItems;
