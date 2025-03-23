"use client";
import MetricsChart from "@/components/MetricsChart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { postMetric } from "@/services/api";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { IndividualSale } from "@/types/types";
import { useMetricsData } from "@/context/MetricsContext";

function DataForm() {
  const [isPending, startTransition] = useTransition();
  const {
    setSales,
  }: {
    setSales: React.Dispatch<React.SetStateAction<IndividualSale[]>>;
  } = useMetricsData();

  const formSchema = z.object({
    sales_rep: z.string().nonempty(),
    amount: z.preprocess((val) => Number(val), z.number().nonnegative()),
    timestamp: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sales_rep: "",
      amount: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    startTransition(async () => {
      try {
        const currentTime = new Date().toISOString();
        const response = await postMetric(
          data.sales_rep,
          data.amount,
          currentTime,
        );
        const newSale: IndividualSale = {
          timestamp: currentTime,
          sales_rep: data.sales_rep,
          amount: data.amount,
        };
        setSales((prev) => [...prev, newSale]);
      } catch (error) {
        console.error("Error posting metric:", error);
      }
    });
    form.reset();
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="sales_rep"
            render={({ field }) => (
              <FormItem className="flex">
                <FormLabel className="w-16">Sales Rep:</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} className="max-w-60" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex">
                <FormLabel className="w-16">Amount:</FormLabel>
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
              disabled={isPending}
              className="w-1/3 bg-blue-700 hover:bg-blue-500"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function Home() {
  return (
    <main className="p-6 bg-[#f7f7f7] h-screen">
      <div className="flex space-y-4">
        <div className="flex flex-col space-y-4 w-1/3 p-5">
          <h1 className="text-2xl font-bold ">Metrics Dashboard</h1>

          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Add sale</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <DataForm />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col space-y-4 w-1/2 p-5">
          <MetricsChart />
        </div>
      </div>
    </main>
  );
}
