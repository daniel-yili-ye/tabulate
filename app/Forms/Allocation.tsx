"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

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
import { useEffect, useState } from "react";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z.object({
  item_allocation: z.array(z.object({ people: z.array(optionSchema).min(1) })),
});
export default function Allocation() {
  const [state, setState] = useAppState();

  const options = state.people.map((person) => ({
    label: person.name,
    value: person.name,
  }));

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    setState({ step: state.step + 1, ...values });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {state.bill_items.map((element, index) => (
          <FormField
            control={form.control}
            key={index}
            name={`item_allocation.${index}.people`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{element.item}</FormLabel>
                <FormControl>
                  <MultipleSelector
                    value={field.value}
                    onChange={field.onChange}
                    defaultOptions={options}
                    placeholder="Select the people who shared this item..."
                    emptyIndicator={
                      <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                        no results found.
                      </p>
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button className="!mt-6" type="submit">
          Next
        </Button>
      </form>
    </Form>
  );
}
