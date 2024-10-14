"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DateRangePicker } from '@/components/date-range-picker';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@supabase/supabase-js';

const formSchema = z.object({
  eventName: z.string().min(2, {
    message: "이벤트 이름은 2글자 이상이어야 합니다.",
  }),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

export default function CreateEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Supabase 클라이언트 초기화
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([
          { 
            name: values.eventName, 
            start_date: values.dateRange.from.toISOString(),
            end_date: values.dateRange.to.toISOString()
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: "이벤트가 생성되었습니다!",
        description: "이벤트 ID: " + data[0].id,
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "오류가 발생했습니다",
        description: "이벤트 생성에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container max-w-md mx-auto mt-10">
      <h1 className="mb-6 text-3xl font-bold text-center">새 이벤트 만들기</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="eventName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이벤트 이름</FormLabel>
                <FormControl>
                  <Input placeholder="팀 회의" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>날짜 범위</FormLabel>
                <DateRangePicker {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "생성 중..." : "이벤트 생성"}
          </Button>
        </form>
      </Form>
    </div>
  );
}