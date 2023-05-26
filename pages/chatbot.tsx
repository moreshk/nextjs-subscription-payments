import { useState, ReactNode, useMemo, useEffect } from 'react';
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MaterialReactTable, { type MRT_ColumnDef } from 'material-react-table';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}
interface Chatbot {
  id: string;
  user_id: string;
  prompt: string;
  created_at: string;
}

type Person = {
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  city: string;
  state: string;
};

//nested data is ok, see accessorKeys in ColumnDef below
const data: Person[] = [
  {
    name: {
      firstName: 'John',
      lastName: 'Doe'
    },
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky'
  },
  {
    name: {
      firstName: 'Jane',
      lastName: 'Doe'
    },
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio'
  },
  {
    name: {
      firstName: 'Joe',
      lastName: 'Doe'
    },
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia'
  },
  {
    name: {
      firstName: 'Kevin',
      lastName: 'Vandy'
    },
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska'
  },
  {
    name: {
      firstName: 'Joshua',
      lastName: 'Rolluffs'
    },
    address: '32188 Larkin Turnpike',
    city: 'Omaha',
    state: 'Nebraska'
  }
];

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
  const [inputValue, setInputValue] = useState('');

  const redirectToChatbotCreation = async () => {
    setLoading(true);
    try {
      const { url, error } = await postRequest({
        url: '/api/create-chatbot',
        data: { prompt: inputValue }
      });
      if (error) {
        throw new Error(error);
      }
      toast.success('Chatbot Added');
      fetchChatbots();
      // window.location.assign(url);
    } catch (error) {
      alert((error as Error).message);
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

  const [fullName, setFullName] = useState(
    userDetails ? userDetails.full_name : ''
  );
  const [isEditing, setIsEditing] = useState(false);

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'name.firstName', //access nested data with dot notation
        header: 'First Name'
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name'
      },
      {
        accessorKey: 'address', //normal accessorKey
        header: 'Address'
      },
      {
        accessorKey: 'city',
        header: 'City'
      },
      {
        accessorKey: 'state',
        header: 'State'
      }
    ],
    []
  );

  const [chatbots, setChatbots] = useState<Chatbot[]>([]);

  useEffect(() => {
    fetchChatbots();
  }, []);

  const fetchChatbots = async () => {
    try {
      const response = await fetch('/api/retrieve-chatbots');
      const data = await response.json();
      setChatbots(data.chatbots);
    } catch (error) {
      console.error('Error fetching chatbots:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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
        {/* Toast container */}
        <ToastContainer />
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
            ) : (
              // ) : subscription ? (
              //   `${subscriptionPrice}/${subscription?.prices?.interval}`
              // ) : (
              <>
                <Input.TextArea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <br />
                <Button
                  variant="slim"
                  loading={loading}
                  disabled={loading}
                  onClick={redirectToChatbotCreation}
                >
                  Create Chatbot
                </Button>
                {/* <Input.TextArea />
                  <br></br>
                  <Button
                    variant="slim"
                    loading={loading}
                    disabled={loading}
                    onClick={redirectToChatbotCreation}
                  >
                    Create Chatbot
                  </Button> */}
              </>
            )}
          </div>
        </Card>
      </div>
      {/* <MaterialReactTable columns={columns} data={data} /> */}

      <div className="font-bold text-3xl text-center mb-8">My Chatbots</div>
      <div className="dark:bg-gray-900">
        <div className="px-20 py-6">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="w-[100px] border border-gray-300 px-4 py-2">
                  Chatbot ID
                </th>
                <th className="border border-gray-300 px-4 py-2">Prompt</th>
                <th className="border border-gray-300 px-4 py-2">
                  Creation Date
                </th>
                <th className="border border-gray-300 px-4 py-2">Embed Link</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {chatbots.map((chatbot: Chatbot) => (
                <tr key={chatbot.id}>
                  <td className="font-medium border border-gray-300 px-4 py-2">
                    {chatbot.id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {chatbot.prompt}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {chatbot.created_at}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <code className="text-white dark:text-gray-100">
                      &lt;script
                      src="https://leadqualifier.koretex.ai/chat-bot-bubble.js"
                      data-chatbot-id="{chatbot.id}"&gt;&lt;/script&gt;
                    </code>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="text-blue-500 dark:text-blue-400"
                      onClick={() =>
                        copyToClipboard(
                          `<script src="https://leadqualifier.koretex.ai/chat-bot-bubble.js" data-chatbot-id="${chatbot.id}"></script>`
                        )
                      }
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
