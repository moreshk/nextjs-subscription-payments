import { useUser } from '@/utils/useUser';
import { supabase } from "@/utils/supabase-client";
import { useEffect, useState } from "react"

export const useChatBotDetails = (id?: string) => {
 const [details, setDetails] = useState<undefined | { [x: string]: any; }[] | null>()
 const [loading, setLoading] = useState(false);
 const { isLoading, userDetails } = useUser();
 const [error, setError] = useState<string | null>(null);
 const [refresh, setRefresh] = useState(false)
 const revalidate = () => setRefresh(!refresh)

 const getAllConversation = async () => {
  if (!userDetails) return
  if (!details) {
   setLoading(true)
  }
  try {
   const { data, error } = await supabase.from('chatbots').select("*").eq('id', id);
   if (error) {
    setError('error in getting all conversation')
   }
   setDetails(data)
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
 }, [userDetails, isLoading, setDetails, refresh]);


 return { details, loading, error, revalidate }

}
