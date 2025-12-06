import { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadMessages();
    }
  }, [isOpen, user]);

  const loadMessages = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !user) return;

    try {
      // Get or create a conversation - simplified for now
      const conversationId = 'general-chat'; // Would need proper conversation logic
      
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            content: message,
            sender_id: user.id,
            conversation_id: conversationId,
          }
        ]);

      if (error) throw error;
      
      setMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Nie udało się wysłać wiadomości');
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-32 right-6 h-16 w-16 rounded-full shadow-glow bg-gradient-primary hover:scale-110 transition-all duration-300 z-50"
        size="icon"
      >
        <Sparkles className="h-8 w-8 text-white" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-52 right-6 w-96 h-[500px] shadow-glow border-2 border-primary/20 z-50 flex flex-col">
          <CardHeader className="bg-gradient-primary text-white rounded-t-lg pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Czat z organizacją
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-4 gap-4">
            {user ? (
              <>
                <ScrollArea ref={scrollRef} className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <Sparkles className="h-12 w-12 mx-auto mb-2 text-primary/50" />
                        <p>Zacznij konwersację!</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              msg.sender_id === user.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.created_at).toLocaleTimeString('pl-PL', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Wpisz wiadomość..."
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary/50" />
                  <p className="text-muted-foreground mb-4">
                    Zaloguj się, aby korzystać z czatu
                  </p>
                  <Button onClick={() => window.location.href = '/auth'}>
                    Zaloguj się
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};
