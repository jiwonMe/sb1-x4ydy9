import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary to-secondary">
      <div className="text-center">
        <Calendar className="w-24 h-24 mx-auto mb-6 text-white" />
        <h1 className="mb-6 text-4xl font-bold text-white">When2Meet Mobile</h1>
        <p className="mb-8 text-lg text-white">쉽고 빠른 일정 조율을 경험하세요</p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/create-event">새 이벤트 만들기</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/join-event">이벤트 참여하기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}