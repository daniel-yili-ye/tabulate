"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Divide } from "lucide-react";

const FormSchema = z.object({
  bill_name: z.string().min(1, {
    message: "Bill Name must be at least 1 characters.",
  }),
  bill_items: z.array(
    z.object({
      bill_item_name: z
        .string()
        .min(1, { message: "Bill Item must be at least 1 characters." }),
      bill_item_price: z.coerce
        .number({
          required_error: "Bill Item Price is required",
          invalid_type_error: "Bill Item Price must be a number",
        })
        .multipleOf(0.01),
    })
  ),
  names: z.array(
    z.object({
      name: z.string().min(1, { message: "Name must be at least 1 character" }),
    })
  ),
});

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

const FormSchemaName = z.object({
  name: z.string().min(1, { message: "Name must be at least 1 character" }),
});

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      bill_name: "",
      bill_items: [],
      names: [],
    },
  });

  const formItem = useForm<z.infer<typeof FormSchemaItem>>({
    resolver: zodResolver(FormSchemaItem),
  });

  const formName = useForm<z.infer<typeof FormSchemaName>>({
    resolver: zodResolver(FormSchemaName),
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

  function onSubmit2(data: any) {
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

  const { fields: billItemFields, append: billItemsAppend } = useFieldArray({
    name: "bill_items",
    control: form.control,
  });

  const { fields: namesFields, append: namesAppend } = useFieldArray({
    name: "names",
    control: form.control,
  });

  return (
    <div className="p-5 space-y-3">
      <div className="flex space-x-3 items-center justify-between	">
        <h1 className="scroll-m-20 text-5xl font-extrabold">Tabulate</h1>
        <ModeToggle />
      </div>
      <p className="text-muted-foreground">
        Effortlessly split the tab with friends. Perfect for splitting itemized
        bills with discounts, taxes, and tips. Say goodbye to complicated
        spreadsheets 👋!
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
            {billItemFields.map((item) => {
              return <div>{item.bill_item_name}</div>;
            })}
            <Label htmlFor="bill-items">Bill Items</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">+ Add Item</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Item</DialogTitle>
                  <DialogDescription>
                    Provide your item name and price details here.
                  </DialogDescription>
                </DialogHeader>
                <Form {...formItem}>
                  <form
                    onSubmit={(e) => {
                      e.stopPropagation();
                      formItem.handleSubmit(onSubmit)(e);
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
          </div>
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="people">People</Label>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">+ Add Name</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
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

                      formName.handleSubmit(onSubmit)(e);
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
  );
}
