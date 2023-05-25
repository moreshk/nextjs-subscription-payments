import {
  createBrowserSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import { ProductWithPrice } from 'types';
import type { Database } from 'types_db';

export const supabase = createBrowserSupabaseClient<Database>();

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }
  // TODO: improve the typing here.
  return (data as any) || [];
};

export const updateUserName = async (user: User, name: string) => {
  await supabase
    .from('users')
    .update({
      full_name: name
    })
    .eq('id', user.id);
};

export const createChatbot = async (user: User, prompt: string) => {
  const { error: supabaseError } = await supabase
    .from('chatbots')
    .insert({ user_id: user.id, prompt: prompt });
  if (supabaseError) throw supabaseError;
  console.log('New chatbot created and inserted');
  return user.id;
};

export const getChatbotsByUserId = async (user: User) => {
  try {
    const { data, error } = await supabase
      .from('chatbots')
      .select()
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.log('Error retrieving chatbots:', error);
    throw error;
  }
};
