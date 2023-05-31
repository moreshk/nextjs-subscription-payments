import { useUser } from '@/utils/useUser';
import { supabase } from "@/utils/supabase-client";
import { useEffect, useState } from "react"

export const useChatBotPromptList = (id?: string) => {
 const [prompts, setPrompts] = useState<undefined | { [x: string]: any; }[] | null>()
 const [loading, setLoading] = useState(false);
 const { isLoading, userDetails } = useUser();
 const [error, setError] = useState<string | null>(null);
 const [refresh, setRefresh] = useState(false)
 const revalidate = () => setRefresh(!refresh)

 const getAllConversation = async () => {
  if (!userDetails) return
  if (!prompts) {
   setLoading(true)
  }
  try {
   const { data, error, } = await supabase.from('chat_questions').select("*").eq('chatbot_id', id);
   if (error) {
    setError('error in getting all conversation')
   }
   setPrompts(data)
   setLoading(false)
  } catch (e) {
   setLoading(false)
   setError('error in getting all conversation')
  }

 };

 useEffect(() => {
  if (userDetails && !isLoading) {
   getAllConversation()
  }
 }, [userDetails, isLoading, setPrompts, refresh]);


 return { prompts, loading, error, revalidate }

}
