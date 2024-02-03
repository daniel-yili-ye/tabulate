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

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      bill_name: "",
      bill_items: [{ bill_item_name: "", bill_item_price: 0 }],
      names: [{ name: "" }],
    },
  });

  const { fields: billItemFields, append: billItemsAppend } = useFieldArray({
    name: "bill_items",
    control: form.control,
  });

  const { fields: namesFields, append: namesAppend } = useFieldArray({
    name: "names",
    control: form.control,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

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
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
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
          <FormField
            control={form.control}
            name="bill_items"
            render={() => (
              <FormItem>
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log(billItemFields);
                    return billItemsAppend({
                      bill_item_name: "",
                      bill_item_price: 0,
                    });
                  }}
                >
                  + Add Bill Item
                </Button>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="names"
            render={() => (
              <FormItem>
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log(namesFields);
                    return namesAppend({
                      name: "",
                    });
                  }}
                >
                  + Add Names
                </Button>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
