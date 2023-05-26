import { NextApiHandler } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import { stripe } from '@/utils/stripe';
import { createOrRetrieveCustomer } from '@/utils/supabase-admin';
import { createChatbot, getChatbotsByUserId } from '@/utils/supabase-client';
import { getURL } from '@/utils/helpers';

const CreateChatbot: NextApiHandler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            const supabase = createServerSupabaseClient({ req, res });
            const {
                data: { user }
            } = await supabase.auth.getUser();

            const { prompt } = req.body;

            if (!user) throw Error('Could not get user');
            const chatbot = await createChatbot(
                user,
                prompt
            );

            return res.status(200).json({ chatbot });
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

export default CreateChatbot;
