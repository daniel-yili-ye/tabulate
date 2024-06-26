"use client";

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
import { useAppState } from "../state";

const formSchema = z.object({
  bill_name: z.string().min(1, {
    message: "Bill Name must be at least 1 characters.",
  }),
  bill_items: z
    .array(
      z.object({
        item: z
          .string()
          .min(1, { message: "Items must be at least 1 characters." }),
        price: z.coerce
          .number({
            required_error: "Price is required",
            invalid_type_error: "Price must be a number",
          })
          .multipleOf(0.01)
          .positive(),
      })
    )
    .min(2, { message: "Please provide at least 2 names." }),
  tax: z.coerce
    .number({
      invalid_type_error: "Tax must be a number",
    })
    .multipleOf(0.01)
    .nonnegative()
    .optional(),
  tip: z.coerce
    .number({
      invalid_type_error: "Tip must be a number",
    })
    .multipleOf(0.01)
    .nonnegative()
    .optional(),
  discount: z.coerce
    .number({
      invalid_type_error: "Discount must be a number",
    })
    .multipleOf(0.01)
    .nonnegative()
    .optional(),
  people: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, { message: "Names must be at least 1 characters." }),
      })
    )
    .min(2, { message: "Please provide at least 2 names." }),
});

export default function Bill() {
  const [state, setState] = useAppState();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bill_items: [
        { item: "", price: undefined },
        { item: "", price: undefined },
      ],
      people: [{ name: "" }, { name: "" }],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    setState({ step: state.step + 1, ...values });
  }

  const { fields: peopleFields, append: peopleAppend } = useFieldArray({
    name: "people",
    control: form.control,
  });
  const { fields: billItemsFields, append: billItemsAppend } = useFieldArray({
    name: "bill_items",
    control: form.control,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="bill_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {billItemsFields.map((element, index) => (
            <div className="flex space-x-2" key={element.id}>
              <FormField
                control={form.control}
                name={`bill_items.${index}.item`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className={index === 0 ? "" : "hidden"}>
                      Item
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`bill_items.${index}.price`}
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormLabel className={index === 0 ? "" : "hidden"}>
                      Price
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => billItemsAppend({ item: "", price: undefined })}
          >
            Add Item
          </Button>
        </div>
        <FormField
          control={form.control}
          name="tax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tip</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {peopleFields.map((element, index) => (
            <FormField
              control={form.control}
              key={element.id}
              name={`people.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={index === 0 ? "" : "hidden"}>
                    People
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => peopleAppend({ name: "" })}
          >
            Add Name
          </Button>
        </div>
        <Button className="!mt-6" type="submit">
          Next
        </Button>
      </form>
    </Form>
  );
}
