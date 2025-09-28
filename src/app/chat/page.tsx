import ChatUI from '@/components/ChatUI';
import AuthGuard from '@/components/AuthGuard';


export default function ChatPage() {
  return (
    <AuthGuard>
    <div className="h-screen flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto w-full shadow-2xl bg-white border-2 border-gold-200">
        <ChatUI />
      </div>
    </div>
    </AuthGuard>
  );
}