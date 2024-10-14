"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { format, parseISO, eachDayOfInterval } from 'date-fns';

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast({
          title: "이벤트를 불러오는 데 실패했습니다",
          description: "다시 시도해주세요.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, toast]);

  const handleDateSelect = (date) => {
    setSelectedDates((prev) => {
      if (prev.includes(date)) {
        return prev.filter((d) => d !== date);
      } else {
        return [...prev, date];
      }
    });
  };

  const handleSubmit = async () => {
    // 여기에서 선택된 날짜를 서버로 전송하는 로직을 구현합니다.
    console.log('Selected dates:', selectedDates);
    toast({
      title: "선택이 저장되었습니다",
      description: "선택한 날짜가 성공적으로 저장되었습니다.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!event) {
    return <div className="text-center">이벤트를 찾을 수 없습니다.</div>;
  }

  const dateRange = eachDayOfInterval({
    start: parseISO(event.start_date),
    end: parseISO(event.end_date)
  });

  return (
    <div className="container max-w-md mx-auto mt-10">
      <h1 className="mb-6 text-3xl font-bold text-center">{event.name}</h1>
      <p className="mb-4 text-center">
        {format(parseISO(event.start_date), 'yyyy년 MM월 dd일')} - {format(parseISO(event.end_date), 'yyyy년 MM월 dd일')}
      </p>
      <Calendar
        mode="multiple"
        selected={selectedDates}
        onSelect={setSelectedDates}
        className="rounded-md border"
        disabled={(date) => !dateRange.some(d => d.getTime() === date.getTime())}
      />
      <Button onClick={handleSubmit} className="w-full mt-4">
        선택 완료
      </Button>
    </div>
  );
}