import { useUser } from '@/utils/useUser';
import { supabase } from "@/utils/supabase-client";
import { useEffect, useState } from "react"

export const useConversationList = () => {
 const [conversationList, setConversationList] = useState<undefined | { [x: string]: any; }[] | null>()
 const [loading, setLoading] = useState(false);
 const { isLoading, userDetails } = useUser();
 const [error, setError] = useState<string | null>(null);

 const getAllConversation = async () => {
  setLoading(true)
  try {
   const { data, error, } = await supabase.from('user_response').select("*");
   if (error) {
    setError('error in getting all conversation')
   }
   console.log(data)
   setConversationList(data)
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
 }, [userDetails, isLoading, setConversationList]);


 return { conversationList, loading, error }

}
