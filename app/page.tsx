import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  return (
    <div className="p-5 space-y-3">
      <div className="flex space-x-3 items-center">
        <h1 className="scroll-m-20 text-5xl font-extrabold">Tabulate</h1>
        <ModeToggle />
      </div>
      <p className="text-muted-foreground">
        Effortlessly split the tab with friends. Perfect for splitting itemized
        bills with discounts, taxes, and tips. Say goodbye to complicated
        spreadsheets 👋!
      </p>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="name">Bill Name</Label>
        <Input
          id="bill-name"
          placeholder="ex. Thursday Happy Hour"
          type="text"
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="bill-items">Bill Items</Label>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">+ Add Item</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Item</DialogTitle>
              <DialogDescription>
                Provide your item name and price details here. Click add once
                you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="item-name"
                  placeholder="ex. PBR Pitcher"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  placeholder="ex. 19.99"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="people">People</Label>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">+ Add Name</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Name</DialogTitle>
              <DialogDescription>
                Provide your name(s) here. You're party cannot have identical
                names.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="person-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="person-name"
                  placeholder="ex. Joe Rogan"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Button type="submit">Tabulate!</Button>
    </div>
  );
}
