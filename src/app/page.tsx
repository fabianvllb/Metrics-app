"use client";
import MetricsChart from "@/components/MetricsChart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function DataForm() {
  const formSchema = z.object({
    name: z.string().nonempty(),
    value: z.number().int(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: 0,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex">
                <FormLabel>Name:</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} className="max-w-60" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className="flex">
                <FormLabel>Value:</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="max-w-30"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-1/3 ">
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default function Home() {
  return (
    <main className="p-6">
      <div className="flex flex-col max-w-5xl space-y-4">
        <h1 className="text-2xl font-bold ml-5">Metrics Dashboard</h1>

        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Add your data</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <DataForm />
          </CardContent>
        </Card>

        {/* <MetricsChart /> */}
      </div>
    </main>
  );
}
