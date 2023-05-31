import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import { useConversationListId } from '@/hooks/useConversationListId';
import { useRouter } from 'next/router';
import LoadingDots from '@/components/ui/LoadingDots/LoadingDots';
import { getFormateTime } from '@/utils/time';

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
  const { conversationList, error, loading } = useConversationListId(
    router.query?.id as string
  );

  if (error) {
    return (
      <Layout>
        <div className="h-12 mb-6">{error}</div>
      </Layout>
    );
  }
  if (loading) {
    return (
      <Layout>
        <div className="h-12 mb-6">
          <LoadingDots />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr className="divide-x divide-gray-200">
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold  sm:pl-0"
                  >
                    Id
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-semibold "
                  >
                    Chatbot Id
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-semibold "
                  >
                    Time
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3.5 text-left text-sm font-semibold "
                  >
                    Question
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold  sm:pr-0"
                  >
                    Bot answer
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {conversationList?.length ? (
                  conversationList?.map((list) => (
                    <tr key={list.id} className="divide-x divide-gray-200">
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium  sm:pl-0">
                        {list?.id}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm max-w-xs">
                        {list?.chatbot_id}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm max-w-xs">
                        {getFormateTime(list.created_at)}
                      </td>
                      <td className="p-4 text-sm  max-w-md">
                        {list?.user_question}
                      </td>
                      <td className="py-4 pl-4 pr-4 text-sm sm:pr-0 max-w-2xl">
                        {list?.bot_answer}
                      </td>
                    </tr>
                  ))
                ) : (
                  <p>No data found</p>
                )}
              </tbody>
            </table>
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
