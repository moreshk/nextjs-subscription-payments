import { NextApiHandler } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import { stripe } from '@/utils/stripe';
import { createOrRetrieveCustomer } from '@/utils/supabase-admin';
import { getChatbotsByUserId } from '@/utils/supabase-client';
import { getURL } from '@/utils/helpers';

const RetrieveChatbots: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const supabase = createServerSupabaseClient({ req, res });
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) throw Error('Could not get user');

        const chatbots = await getChatbotsByUserId(
            user
        );

      return res.status(200).json({ chatbots });
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default RetrieveChatbots;
