import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import LoadingDots from '@/components/ui/LoadingDots';
import Button from '@/components/ui/Button';
import { useUser } from '@/utils/useUser';
import { postRequest } from '@/utils/helpers';
import { updateUserName } from '@/utils/supabase-client';
import { Input } from '@supabase/ui';
import { useConversationList } from '@/hooks/useConversationList';
import { useRouter } from 'next/router';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session }
  } = await supabase.auth.getSession();
  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };

  return {
    props: {
      initialSession: session,
      user: session.user
    }
  };
};

export default function Chatbot({ user }: { user: User }) {
  const router = useRouter();
  return (
    <Layout>
      <div className="flow-root">
        <div>
          <p className="text-center mb-3">
            To add the chatbot any where on your website, add this iframe to
            your html code
          </p>
          <div className="bg-gray-900 max-w-3xl m-auto overflow-y-auto rounded-xl py-2 pl-6 font-medium">
            <p>{`<iframe`}</p>
            <p>
              {`src="https://leadqualifier.koretex.ai/?chatbotId=${router.query?.id}"`}
            </p>
            <p>{`width="100%"`}</p>
            <p>{`height="700"`}</p>
            <p>{`frameborder="0"`}</p>
            <p>{`></iframe>`}</p>
          </div>
        </div>
        <div className="mt-10">
          <p className="text-center mb-3">
            To add the chatbot as a bubble and popup on your website add this script to your html code
          </p>
          <div className=" bg-gray-900 max-w-3xl m-auto overflow-y-auto rounded-xl py-2 pl-6 font-medium">
            <p>{`<script`}</p>
            <p>{`src="https://leadqualifier.koretex.ai/chat-bot-bubble.js"`}</p>
            <p>{`data-chatbot-id="${router.query?.id}">`}</p>
            <p>{`</script>`}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const Layout = ({ children }: { children: ReactNode }) => (
  <section className="bg-black mb-32">
    <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:flex-col sm:align-center">
        <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
          Embed on website
        </h1>
        <p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
          Powered by Koretex AI
        </p>
      </div>
    </div>
    <div className="p-4">
      <div className="text-xl mt-8 mb-4 font-semibold">{children}</div>
    </div>
  </section>
);
