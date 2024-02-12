"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchemaItem = z.object({
  bill_item_name: z
    .string()
    .min(1, { message: "Bill Item must be at least 1 characters." }),
  bill_item_price: z.coerce
    .number({
      required_error: "Bill Item Price is required",
      invalid_type_error: "Bill Item Price must be a number",
    })
    .multipleOf(0.01),
});

const FormSchemaOtherItem = z.object({
  bill_other_item_name: z.string(),
  bill_other_item_amt: z.coerce
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .multipleOf(0.01),
});

const FormSchemaName = z.object({
  name: z.string().min(1, { message: "Name must be at least 1 character" }),
});

const FormSchema = z.object({
  bill_name: z.string().min(1, {
    message: "Bill Name must be at least 1 characters.",
  }),
  bill_items: z.array(FormSchemaItem),
  bill_other_items: z.array(FormSchemaOtherItem),
  names: z.array(FormSchemaName),
});

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      bill_name: "",
      bill_items: [],
      bill_other_items: [],
      names: [],
    },
  });

  const formItemDefaultValues = {
    bill_item_name: "",
    // bill_item_price: 0,
  };

  const formItem = useForm<z.infer<typeof FormSchemaItem>>({
    resolver: zodResolver(FormSchemaItem),
    defaultValues: formItemDefaultValues,
  });

  const formOtherItemDefaultValues = {
    // bill_other_item_name: "",
    // bill_other_item_amt: 0,
  };

  const formOtherItem = useForm<z.infer<typeof FormSchemaOtherItem>>({
    resolver: zodResolver(FormSchemaOtherItem),
    defaultValues: formOtherItemDefaultValues,
  });

  const formNameDefaultValues = {
    name: "",
  };

  const formName = useForm<z.infer<typeof FormSchemaName>>({
    resolver: zodResolver(FormSchemaName),
    defaultValues: formNameDefaultValues,
  });

  function onSubmit(data: any) {
    console.log(data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  function onAddItem(data: any) {
    billItemsAppend(data);
    // formItem.reset(formItemDefaultValues);
  }

  function onAddOtherItem(data: any) {
    otherItemAppend(data);
    // formOtherItem.reset(formOtherItemDefaultValues);
  }

  function onAddName(data: any) {
    namesAppend(data);
    formName.reset(formNameDefaultValues);
  }

  const { fields: billItemFields, append: billItemsAppend } = useFieldArray({
    name: "bill_items",
    control: form.control,
  });

  const { fields: billOtherItemFields, append: otherItemAppend } =
    useFieldArray({
      name: "bill_other_items",
      control: form.control,
    });

  const { fields: namesFields, append: namesAppend } = useFieldArray({
    name: "names",
    control: form.control,
  });

  return (
    <div className="flex justify-center">
      <div className="p-5 space-y-3 sm:w-[36rem] sm:p-10">
        <div className="flex space-x-3 items-center justify-between	">
          <h1 className="scroll-m-20 text-5xl font-extrabold">Tabulate</h1>
          <ModeToggle />
        </div>
        <p className="text-muted-foreground">
          Effortlessly split the tab with friends. Perfect for splitting
          itemized bills with discounts, taxes, and tips. Say goodbye to
          complicated spreadsheets 👋!
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="bill_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bill Name</FormLabel>
                  <FormControl>
                    <Input placeholder="ex. Thursday Happy Hour" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="bill-items">Items</Label>
              {billItemFields.length > 0 ? (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {billItemFields.map((item) => (
                        <TableRow>
                          <TableCell className="font-medium">
                            {item.bill_item_name}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.bill_item_price.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              ) : (
                <></>
              )}
              {billOtherItemFields.length > 0 ? (
                <Card>
                  <Table>
                    <TableBody>
                      {billOtherItemFields.map((item) => (
                        <TableRow>
                          <TableCell className="font-medium">
                            {item.bill_other_item_name}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.bill_other_item_amt.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              ) : (
                <></>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">+ Add Bill Item</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[42rem]">
                  <DialogHeader>
                    <DialogTitle>Bill Item</DialogTitle>
                    <DialogDescription>
                      Provide your item name and price details here.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...formItem}>
                    <form
                      onSubmit={(e) => {
                        e.stopPropagation();
                        formItem.handleSubmit(onAddItem)(e);
                      }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          name="bill_item_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bill Item Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="ex. Sapporo Pitcher"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="bill_item_price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bill Item Price</FormLabel>
                              <FormControl>
                                <Input placeholder="ex. 12.99" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit">Add</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">+ Add Tax / Tip / Discount</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[42rem]">
                  <DialogHeader>
                    <DialogTitle>Tax / Tip / Discount</DialogTitle>
                    <DialogDescription>
                      Provide your item and amount details here.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...formOtherItem}>
                    <form
                      onSubmit={(e) => {
                        e.stopPropagation();
                        formOtherItem.handleSubmit(onAddOtherItem)(e);
                      }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          name="bill_other_item_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Tax">Tax</SelectItem>
                                    <SelectItem value="Tip">Tip</SelectItem>
                                    <SelectItem value="Discount">
                                      Discount
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="bill_other_item_amt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input placeholder="ex. 12.99" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit">Add</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid w-full items-center gap-3">
              <Label htmlFor="people">People</Label>
              {namesFields.length > 0 ? (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {namesFields.map((item) => (
                        <TableRow>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              ) : (
                <></>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">+ Add People</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[42rem]">
                  <DialogHeader>
                    <DialogTitle>Name</DialogTitle>
                    <DialogDescription>
                      Provide your name(s) here.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...formName}>
                    <form
                      onSubmit={(e) => {
                        e.stopPropagation();
                        formName.handleSubmit(onAddName)(e);
                      }}
                      className="space-y-6"
                    >
                      <FormField
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input placeholder="ex. Joe Rogan" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Add</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
