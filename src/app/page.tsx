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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { postMetric } from "@/services/api";
import { useState } from "react";

function DataForm() {
  const [successMsg, setSuccessMsg] = useState("This is a test message");

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

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    try {
      const response = await postMetric(data.name, data.value);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-4 ">
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

          <div className="flex justify-end">
            <Button
              type="submit"
              className="w-1/3 bg-blue-500 hover:bg-blue-700"
            >
              Add
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex justify-end">
        <p className=" text-sm font-semibold ">{successMsg}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="p-6 bg-[#f7f7f7] h-screen">
      <div className="flex  space-y-4">
        <div className="flex flex-col space-y-4 w-1/3 p-5">
          <h1 className="text-2xl font-bold ">Metrics Dashboard</h1>

          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Add your data</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <DataForm />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col space-y-4 w-1/2 p-5">
          <h2 className="text-xl font-semibold ">Chart</h2>

          <MetricsChart />
        </div>
      </div>
    </main>
  );
}
