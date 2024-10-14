"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  eventId: z.string().min(1, {
    message: "이벤트 ID를 입력해주세요.",
  }),
});

export default function JoinEvent() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', values.eventId)
        .single();

      if (error) throw error;

      if (data) {
        toast({
          title: "이벤트를 찾았습니다!",
          description: "이벤트 페이지로 이동합니다.",
        });
        router.push(`/event/${values.eventId}`);
      } else {
        toast({
          title: "이벤트를 찾을 수 없습니다",
          description: "올바른 이벤트 ID를 입력했는지 확인해주세요.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error joining event:', error);
      toast({
        title: "오류가 발생했습니다",
        description: "이벤트 참여에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container max-w-md mx-auto mt-10">
      <h1 className="mb-6 text-3xl font-bold text-center">이벤트 참여하기</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="eventId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이벤트 ID</FormLabel>
                <FormControl>
                  <Input placeholder="이벤트 ID를 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "참여 중..." : "이벤트 참여"}
          </Button>
        </form>
      </Form>
    </div>
  );
}