import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import { supabase } from '@/utils/supabase-client';

import LoadingDots from '@/components/ui/LoadingDots';
import Button from '@/components/ui/Button';
import { useUser } from '@/utils/useUser';
import { postRequest } from '@/utils/helpers';
import { updateUserName } from '@/utils/supabase-client';
import { Input } from '@supabase/ui';
import { toast } from 'react-hot-toast';
import { useBotList } from '@/hooks/useBotList';
import Router, { useRouter } from 'next/router';
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
  const [loading, setLoading] = useState(false);
  const [botName, setBotName] = useState('');
  const { botList, error, loading: botListLoading, revalidate } = useBotList();

  return (
    <section className="bg-black mb-32">
      <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Create Chatbot
          </h1>
          <p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
            Powered by Koretex AI
          </p>
        </div>
      </div>
      <div className="p-4">
        <div className="text-xl mt-8 mb-4 font-semibold">
          <div className="max-w-sm m-auto flex flex-col gap-3">
            <div>
              <p>Bot name</p>
              <Input
                disabled={loading}
                onChange={(e) => setBotName(e.target.value)}
                value={botName}
              />
            </div>
            <Button
              variant="slim"
              className="w-full"
              loading={loading}
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  const { status } = await supabase
                    .from('chatbots')
                    .insert({ name: botName, user_id: user.id });
                  if (status === 201) {
                    toast('Chatbot created successfully.');
                    revalidate();
                    setBotName('');
                  } else {
                    toast('Unable to create chatbot. Please try again later.');
                  }
                  setLoading(false);
                } catch (e) {
                  setLoading(false);
                  toast('Unable to create chatbot. Please try again later.');
                }
              }}
            >
              Create Chatbot
            </Button>
          </div>
        </div>
        {botListLoading ? (
          <div className="m-auto mt-8 w-full flex items-center justify-center">
            <LoadingDots />
          </div>
        ) : (
          botList && (
            <div className="mt-8">
              <table className="max-w-4xl m-auto divide-y divide-gray-300">
                <thead>
                  <tr className="divide-x divide-gray-200">
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold sm:pl-0"
                    >
                      Id
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
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold "
                    >
                      Embeddings
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold "
                    >
                      Conversation
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold "
                    >
                      Add Prompt
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {botList?.map((list) => (
                    <tr
                      key={list.id}
                      className="divide-x divide-gray-200 hover:bg-slate-900 cursor-pointer"
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium  sm:pl-0">
                        {list?.id}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm max-w-xs">
                        {getFormateTime(list?.created_at)}
                      </td>
                      <td className="p-4 text-sm">{list?.name || '-'}</td>
                      <td
                        className="cursor-pointer  p-4 text-sm max-w-xs"
                        onClick={() => {
                          Router.push(`/chatbot/embedding/${list.id}`);
                        }}
                      >
                        &#8599;
                      </td>
                      <td
                        className="cursor-pointer  p-4 text-sm max-w-xs"
                        onClick={() => {
                          Router.push(`/chatbot/conversation/${list.id}`);
                        }}
                      >
                        &#8599;
                      </td>
                      <td
                        className="cursor-pointer  p-4 text-sm max-w-xs"
                        onClick={() => {
                          Router.push(`/chatbot/prompt/${list.id}`);
                        }}
                      >
                        +
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </section>
  );
}
