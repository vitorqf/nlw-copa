import Image from 'next/image'
import appMockup from '../assets/app-mockup.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheck from '../assets/check.svg'
import { api } from '../lib/axios'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home(props: HomeProps) {
  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center'>
      <main>
        <Image src={logoImg} alt="NLW Copa" />

        <h1 
          className='mt-14 text-white text-5xl font-bold leading-tight'
        >
          Create your own pool and share with your friends!
        </h1>

        <div
          className='mt-10 flex items-center gap-2'        
        >
          <Image src={usersAvatarExampleImg} alt=""/>
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> already using!
          </strong>
        </div>

        <form className='mt-10 flex gap-2'>
          <input 
            type="text" 
            required 
            placeholder="What's your pool name?"
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm' 
          />
          <button 
            type="submit"
            className='bg-yellow-500 px-6 py-4 rounded uppercase text-gray-900 font-bold text-sm hover:bg-yellow-700 active:bg-yellow-700 transition-colors'
          >Create pool</button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          After creating your pool, you will receive an unique code to share 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>

          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt="" />
            <div className='flex flex-col'>
              <span className='text-2xl font-bold'>+{props.poolCount}</span>
              <span>Created pools</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600'/>

          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt="" />
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
        alt="Two mobile devices showing a preview of NLW-Copa application"
        quality={100}
      />

    </div>
  )
}

export const getServerSideProps = async () => {
  const [poolCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get('/pools/count'),
    api.get('/guesses/count'),
    api.get('/users/count')
  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}