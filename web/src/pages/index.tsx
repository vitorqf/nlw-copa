import classNames from 'classnames';
import Image from 'next/image';
import { FormEvent, useState } from 'react';

import appMockup from '../assets/app-mockup.png';
import iconCheck from '../assets/check.svg';
import logoImg from '../assets/logo.svg';
import usersAvatarExampleImg from '../assets/users-avatar-example.png';
import { api } from '../lib/axios';

interface HomeProps {
  pollCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [pollTitle, setPollTitle] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function createPoll(event: FormEvent) {
    event.preventDefault();

    try {
      const res = await api.post('/polls', {
        title: pollTitle,
      });

      const { code } = res.data;

      await navigator.clipboard.writeText(code);

      setPollTitle('');

      setSuccessMessage(
        'Poll successfully created! Code copied into clipboard.'
      );

      setTimeout(() => {
        setSuccessMessage('');
      }, 10000);
    } catch (err) {
      setErrorMessage(
        `Failed to create a new poll. Detailed error message: ${err}`
      );
      setTimeout(() => {
        setErrorMessage('');
      }, 10000);
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <title>NLW Copa</title>
      <main>
        <Image
          src={logoImg}
          alt='NLW Copa'
        />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Create your own poll and share with your friends!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image
            src={usersAvatarExampleImg}
            alt=''
          />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> already
            using!
          </strong>
        </div>

        <form
          onSubmit={createPoll}
          className='mt-10 mb-4 flex gap-2'
        >
          <input
            type='text'
            required
            placeholder="What's your poll name?"
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            onChange={e => setPollTitle(e.target.value)}
            value={pollTitle}
          />
          <button
            type='submit'
            className='bg-yellow-500 px-6 py-4 rounded uppercase text-gray-900 font-bold text-sm hover:bg-yellow-700 active:bg-yellow-700 transition-colors'
          >
            Create poll
          </button>
        </form>

        {successMessage.length > 0 || errorMessage.length > 0 ? (
          <span
            className={classNames(
              'my-4 text-gray-100 rounded p-2 bg-opacity-70 text-sm',
              {
                'bg-ignite-500': successMessage.length > 0,
                'bg-red-500': errorMessage.length > 0,
              }
            )}
          >
            {successMessage.length > 0
              ? successMessage
              : errorMessage.length > 0
              ? errorMessage
              : ''}
          </span>
        ) : (
          ''
        )}

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          After creating your poll, you will receive an unique code to share 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image
              src={iconCheck}
              alt=''
            />
            <div className='flex flex-col'>
              <span className='text-2xl font-bold'>+{props.pollCount}</span>
              <span>Created polls</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600' />

          <div className='flex items-center gap-6'>
            <Image
              src={iconCheck}
              alt=''
            />
            <div className='flex flex-col'>
              <span className='text-2xl font-bold'>+{props.guessCount}</span>
              <span>Sent guesses</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        className='animate-floating translate-y-0 transition-all'
        src={appMockup}
        alt='Two mobile devices showing a preview of NLW-Copa application'
        quality={100}
      />
    </div>
  );
}

export const getStaticProps = async () => {
  const [pollCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get('/polls/count'),
      api.get('/guesses/count'),
      api.get('/users/count'),
    ]);

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
    revalidate: 3600,
  };
};
