import AuthGuard from '@/components/AuthGuard';
import ChatUI from '@/components/ChatUI';


export default function ChatPage() {
  return (
    <AuthGuard>
    <div className="h-screen flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto w-full shadow-2xl bg-white border-4 border-gold-200 mt-6 rounded-lg">
        <ChatUI />
      </div>
    </div>
    </AuthGuard>
  );
}