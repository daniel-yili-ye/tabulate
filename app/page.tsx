import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div className="p-5 space-y-3">
      <h1 className="scroll-m-20 text-5xl font-extrabold">Tabulate</h1>
      <p className="text-muted-foreground">
        Effortlessly split the tab with friends. Perfect for splitting itemized
        bills with discounts, taxes, and tips. Say goodbye to complicated
        spreadsheets 👋!
      </p>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Name" type="text" />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="bill">Bill</Label>
        <Input id="bill" placeholder="Item" type="text" />
      </div>
    </div>
  );
}
