import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TableLimitSelectorProps = {
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const LIMIT_OPTIONS = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 30, label: "30" },
  { value: 40, label: "40" },
  { value: 50, label: "50" },
];

export default function TableLimitSelector({
  limit,
  setLimit,
  page,
  setPage,
}: TableLimitSelectorProps) {
  console.log("lmit: ", limit);
  console.log("page from limit selector: ", page);
  return (
    <Select
      value={limit === -1 ? "all" : String(limit)}
      onValueChange={(value) => {
        setLimit(value === "all" ? -1 : Number(value));
        setPage(1);
      }}
    >
      <SelectTrigger className="w-[80px]" size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {LIMIT_OPTIONS.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value === -1 ? "all" : String(option.value)}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
