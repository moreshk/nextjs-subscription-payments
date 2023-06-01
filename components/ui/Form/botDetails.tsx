import { supabase } from '@/utils/supabase-client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  useFormContext,
  Controller,
  useForm,
  FormProvider,
  useFieldArray
} from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Button from '../Button/Button';

type Props = {
  default: any;
};

export const BotDetails = ({ defaultValues }: { defaultValues: any }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({ defaultValues });
  const { handleSubmit, control } = form;
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'questions'
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const { status, error } = await supabase
        .from('chatbots')
        .update({
          name: data,
          business_name: data.business_name,
          about_us: data.about_us
        })
        .eq('id', router.query?.id as string);
      const { status: questionStatus, error: questionError } = await supabase
        .from('chat_questions')
        .upsert([...data.questions]);
      if (error) {
        toast.error('unable to update');
      }
      console.log(questionError);
      if (questionError) {
        toast.error('unable to update question');
      }
      setLoading(false);

      if (questionStatus === 204) {
        toast.success('Updated successfully');
        return;
      }
      if (status === 204) {
        toast.success('Updated successfully');
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <div className="grid grid-cols-2">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-16">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input name="name" displayName="Chat bot Name" />
            </div>
            <div className="sm:col-span-2">
              <Input
                name="business_name"
                displayName="Business Name"
                disable={loading}
              />
            </div>
            <div className="sm:col-span-2">
              <InputArea name="about_us" displayName="About business" />
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="sm:col-span-2 flex items-center">
                <InputArea
                  name={`questions.${index}.question`}
                  displayName={`Question ${index + 1}`}
                />
                <button
                  type="button"
                  className="text-left"
                  onClick={() => remove(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-red-700 ml-3 mt-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex justify-end sm:col-span-2 mr-10">
              <button
                type="button"
                onClick={() => append({ key: '', value: '' })}
              >
                Add Question
              </button>
            </div>
          </div>
          <div className="mt-10 flex justify-end border-t border-gray-900/10 pt-8 mr-9">
            <Button loading={loading} disabled={loading}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

const Input = ({
  name,
  displayName,
  disable
}: {
  name: string;
  displayName: string;
  disable?: boolean;
}) => {
  const { register } = useFormContext();
  return (
    <div className="flex-1 w-full">
      <label htmlFor="email" className="block text-sm font-semibold leading-6 ">
        {displayName}
      </label>
      <div className="mt-2.5">
        <input
          {...register(name)}
          type="text"
          disabled={disable}
          className="block rounded-md border-0 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-black w-full"
        />
      </div>
    </div>
  );
};
const InputArea = ({
  name,
  displayName,
  disable
}: {
  name: string;
  displayName: string;
  disable?: boolean;
}) => {
  const { register } = useFormContext();
  return (
    <div className="sm:col-span-2 w-full">
      <label htmlFor="email" className="block text-sm font-semibold leading-6 ">
        {displayName}
      </label>
      <div className="mt-2.5">
        <textarea
          disabled={disable}
          {...register(name)}
          className="block w-full rounded-md border-0 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-black"
        />
      </div>
    </div>
  );
};
