import { useUser } from '@/utils/useUser';
import { supabase } from "@/utils/supabase-client";
import { useEffect, useState } from "react"

export const useBotList = () => {
 const [botList, setBotList] = useState<undefined | { [x: string]: any; }[] | null>()
 const [loading, setLoading] = useState(false);
 const [refresh, setRefresh] = useState(false)
 const { isLoading, userDetails } = useUser();
 const [error, setError] = useState<string | null>(null);

 const getAllBot = async () => {
  if (!userDetails) return
  if (!botList) {
   setLoading(true)
  }
  try {
   const { data, error, } = await supabase.from('chatbots').select("*").eq('user_id', userDetails.id);
   if (error) {
    setError('error in getting all bots')
   }
   setBotList(data)
   setLoading(false)
  } catch (e) {
   setLoading(false)
   setError('error in getting all bots')
  }
 };

 const revalidate = () => setRefresh(!refresh)

 useEffect(() => {
  if (userDetails && !isLoading) {
   getAllBot()
  }
 }, [userDetails, isLoading, setBotList, refresh]);


 return { botList, loading, error, revalidate }

}
