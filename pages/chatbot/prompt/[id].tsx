import { ReactNode } from 'react';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import LoadingDots from '@/components/ui/LoadingDots/LoadingDots';
import { useChatBotPromptList } from '@/hooks/useChatBotPromptList';
import BotDetails from '@/components/ui/Form/botDetails';
import { useChatBotDetails } from '@/hooks/useChatBotDetails';

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
  const { prompts, error, loading } = useChatBotPromptList(
    router.query?.id as string
  );
  const {
    details,
    error: detailsError,
    loading: detailsLoading,
    revalidate
  } = useChatBotDetails(router.query?.id as string);
  if (error || detailsError) {
    return (
      <Layout>
        <div className="h-12 mb-6">Unable to load details</div>
      </Layout>
    );
  }
  if (loading || detailsLoading) {
    return (
      <Layout>
        <div className="h-12 mb-6">
          <LoadingDots />
        </div>
      </Layout>
    );
  }
  if (prompts && details && details.length > 0) {
    return (
      <Layout>
        <div className="mt-8 flow-root">
          <BotDetails defaultValues={{ questions: prompts, ...details[0] }} />
        </div>
      </Layout>
    );
  }
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
