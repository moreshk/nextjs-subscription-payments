import { useState, ReactNode } from 'react';
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
import { Input } from "@supabase/ui";

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      {/* <div className="border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500 rounded-b-md">
        {footer}
      </div> */}
    </div>
  );
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
  // const { isLoading, subscription, userDetails } = useUser();
  const { isLoading, userDetails } = useUser();

  const redirectToChatbotCreation = async () => {
    setLoading(true);
    try {
      const { url, error } = await postRequest({
        url: '/api/create-chatbot',
        data: {"prompt": "This is test prompt"}
      });
      console.log("hits here");
      // window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  // const subscriptionPrice =
  //   subscription &&
  //   new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: subscription?.prices?.currency,
  //     minimumFractionDigits: 0
  //   }).format((subscription?.prices?.unit_amount || 0) / 100);

  const [fullName, setFullName] = useState(userDetails ? userDetails.full_name : "");
  const [isEditing, setIsEditing] = useState(false);

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
        <Card
          title="Add Chatbot Prompt"
          // description={
          //   subscription
          //     ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
          //     : ''
          // }
          // footer={
          //   <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
          //     <p className="pb-4 sm:pb-0">
          //       Manage your subscription on Stripe.
          //     </p>
          //     <Button
          //       variant="slim"
          //       loading={loading}
          //       disabled={loading || !subscription}
          //       onClick={redirectToChatbotCreation}
          //     >
          //       Open customer portal
          //     </Button>
          //   </div>
          // }
        >
          <div className="text-xl mt-8 mb-4 font-semibold">
            {isLoading ? (
              <div className="h-12 mb-6">
                <LoadingDots />
              </div>
            ) :
            // ) : subscription ? (
            //   `${subscriptionPrice}/${subscription?.prices?.interval}`
            // ) : (
              (
              <>
                <Input.TextArea />
                <br></br>
                <Button
                  variant="slim"
                  loading={loading}
                  disabled={loading}
                  onClick={redirectToChatbotCreation}
                >
                  Create Chatbot
                </Button>
              </>
            )}
          </div>
        </Card>

       {/* <Card
          title="Your Name"
          description="Please enter your full name, or a display name you are comfortable with."
          footer={<p>Please use 64 characters at maximum.</p>}
        >
          <div className="text-xl mt-8 mb-4 font-semibold">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="..."
                />
                <button
                  onClick={async () => {
                    if (user && user.id && fullName) {
                      await updateUserName(user.id, fullName);
                      await refreshUserDetails();
                      setIsEditing(false);
                    } else {
                      console.error('User ID not found or name not entered');
                    }
                  }}
                  className="..."
                >
                  Save
                </button>
              </>
            ) : (
              <>
                {userDetails ? (
                  `${userDetails.full_name}`
                ) : (
                  <div className="h-8 mb-6">
                    <LoadingDots />
                  </div>
                )}
                <button onClick={() => setIsEditing(true)} className="...">Edit</button>
              </>
            )}
          </div>
        </Card> */}
      </div>
    </section>
  );
}
