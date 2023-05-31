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
import { useChatBotPromptList } from '@/hooks/useChatBotPromptList';
import Button from '@/components/ui/Button/Button';
import { toast } from 'react-hot-toast';
import { supabase } from '@/utils/supabase-client';
import { Input } from '@supabase/ui';

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
  const [submitLoading, setSubmitLoading] = useState(false);
  const [botName, setBotName] = useState('');
  const { prompts, error, loading, revalidate } = useChatBotPromptList(
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
            <div className="text-xl mt-8 mb-4 font-semibold">
              <div className="max-w-sm m-auto flex flex-col gap-3">
                <div>
                  <p>Add name Question</p>
                  <Input
                    disabled={submitLoading}
                    onChange={(e) => setBotName(e.target.value)}
                    value={botName}
                  />
                </div>
                <Button
                  variant="slim"
                  className="w-full"
                  loading={submitLoading}
                  disabled={submitLoading}
                  onClick={async () => {
                    setSubmitLoading(true);
                    try {
                      const { status } = await supabase
                        .from('chat_questions')
                        .insert({
                          question: botName,
                          question_number: prompts ? prompts.length + 1 : 1,
                          chatbot_id: router.query?.id as string
                        });
                      if (status === 201) {
                        toast('Question added created successfully.');
                        revalidate();
                        setBotName('');
                      } else {
                        toast(
                          'Unable to add question. Please try again later.'
                        );
                      }
                      setSubmitLoading(false);
                    } catch (e) {
                      setSubmitLoading(false);
                      toast('unable to add question. Please try again later.');
                    }
                  }}
                >
                  Add Question
                </Button>
              </div>
            </div>

            <div className=" max-w-2xl grid m-auto gap-2">
              {prompts?.map((prompt) => {
                return (
                  <InputQuestion
                    question={prompt.question}
                    id={prompt.id}
                    key={prompt.id}
                    revalidate={revalidate}
                  />
                );
              })}
            </div>
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

const InputQuestion = ({
  question,
  id,
  revalidate
}: {
  question: string;
  id: string;
  revalidate: () => void;
}) => {
  const [value, setValue] = useState(question);
  const [submitLoading, setSubmitLoading] = useState(false);
  const router = useRouter();

  return (
    <div key={id} className="flex gap-2">
      <Input
        className="w-full"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        disabled={submitLoading}
      />
      <Button
        loading={submitLoading}
        variant="slim"
        onClick={async () => {
          setSubmitLoading(true);
          try {
            const { status, error } = await supabase
              .from('chat_questions')
              .update({
                question: value
              })
              .eq('id', id);
            if (status === 204) {
              toast('Question added created successfully.');
            } else {
              toast('Unable to add question. Please try again later.');
            }
            setSubmitLoading(false);
          } catch (e) {
            setValue(question);
            setSubmitLoading(false);
            toast('unable to add question. Please try again later.');
          }
        }}
      >
        Update
      </Button>
      <Button
        loading={submitLoading}
        variant="slim"
        onClick={async () => {
          setSubmitLoading(true);
          try {
            const { status } = await supabase
              .from('chat_questions')
              .delete()
              .eq('id', id);
            if (status === 204) {
              toast('Question added created successfully.');
            } else {
              toast('Unable to add question. Please try again later.');
            }
            setSubmitLoading(false);
          } catch (e) {
            setValue(question);
            setSubmitLoading(false);
            toast('unable to add question. Please try again later.');
          }
        }}
      >
        Delete
      </Button>
    </div>
  );
};
