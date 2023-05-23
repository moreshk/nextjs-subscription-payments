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

// export const updateUserName = async (user: User, name: string) => {
//   await supabase
//     .from('users')
//     .update({
//       full_name: name
//     })
//     .eq('id', user.id);
// };

export const updateUserName = async (userId: string, fullName: string) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ full_name: fullName })
      .eq('id', userId);
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Failed to update user name:", error);
  }
};
