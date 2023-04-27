import { Dongle, Rubik_Wet_Paint } from 'next/font/google'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react';
import Head from 'next/head'
import axios from 'axios';

const displayFont = Rubik_Wet_Paint({
  subsets: ['latin'],
  weight: '400'
});

const sansFont = Dongle({
  subsets: ['latin'],
  weight: '400'
});

type Props = {
  email: string | null;
}

type Stats = {
  unique: number;
  total: number;
}

const Home = ({ email }: Props) => {
  const [stats, setStats] = useState<Stats>()

  useEffect(() => {
    axios.post('/api/visit', { email }).then(() => {
      axios.get('/api/stats').then(({ data }) => setStats(data))
    })
  }, [email])

  return (
    <>
      <Head>
        <title>You Have Been Phished</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={sansFont.className}>
        <h1 className={displayFont.className} style={{ color: '#0f0', fontSize: 96 }}>
          You have been phished
        </h1>

        <h2 style={{ color: '#0af', fontSize: 64 }}>
          You have clicked a link without carefully inspecting it first
        </h2>

        <p>It could have had disastrous consequences, but fortunately this is only a simulation</p>

        <p>Please do not share what happened with anyone besides Miguel, the goal is to see how many people click or report the link within a time period</p>

        <table style={{ borderSpacing: '24px 8px' }}>
          <tbody>
            <tr>
              <td>Total visits</td>

              <td>{stats?.total ?? '...'}</td>
            </tr>

            <tr>
              <td>Unique victims</td>

              <td>{stats?.unique ?? '...'}</td>
            </tr>
          </tbody>
        </table>

        {email ? (
          <p>Your email is <a href={'mailto:'+email}>{email}</a></p>
        ) : (
          <p>It looks like you managed to hide your email address at least</p>
        )}
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const email = (() => {
    try {
      return Buffer.from(ctx.query?.id as string, 'base64').toString('ascii');
    } catch {
      return null;
    }
  })();

  return {
    props: { email }
  }
}

export default Home;
