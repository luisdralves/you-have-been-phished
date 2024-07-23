import { Dongle, Rubik_Wet_Paint } from 'next/font/google';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  stats: {
    unique: number;
    total: number;
  };
}

const Home = ({ stats }: Props) => (
  <>
    <Head>
      <title>You Have Been Phished</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className={sansFont.className}>
      <h1 className={displayFont.className} style={{ color: '#0f0', fontSize: 72 }}>
        You have been phished
      </h1>

      <h2 style={{ color: '#0af', fontSize: 54 }}>
        You have clicked a link without carefully inspecting it first
      </h2>

      <p>It could have had disastrous consequences, but fortunately this is only a simulation</p>

      <p style={{ border:'solid 1px #f008', padding: '24px' }}>
        <b><u>Please do not share what happened with anyone besides Miguel</u></b>, the goal is to see how many people click or report the link within a certain time period
      </p>

      {stats?.total && (
        <table style={{ borderSpacing: '24px 8px' }}>
          <tbody>
            <tr>
              <td>Total visits</td>

              <td>{stats.total}</td>
            </tr>

            <tr>
              <td>Unique victims</td>

              <td>{stats.unique}</td>
            </tr>
          </tbody>
        </table>
      )}
    </main>
  </>
);

export const getServerSideProps: GetServerSideProps = async ctx => {
  const [emailHash, email] = await (async () => {
    try {
      const crypto = require('crypto');
      const emailBuffer = Buffer.from(ctx.query?.id as string, 'base64');
      const emailHash = await crypto.subtle.digest("SHA-1", emailBuffer);

      return [
        Buffer.from(emailHash).toString('base64') ?? 'null',
        emailBuffer.toString('ascii')
      ];
    } catch {
      return ['null', null];
    }
  })();

  const visitor = await prisma.visitor.findUnique({
    where: { email: emailHash }
  });

  const previousVisits = visitor?.visits ?? 0
  await prisma.visitor.upsert({
    where: { email: emailHash },
    create: {
      email: emailHash,
      visits: 1
    },
    update: {
      visits: previousVisits + 1
    }
  });

  const visitors = await prisma.visitor.findMany({
    where: {
      visits: {
        gte: 1
      }
    }
  });

  const total = visitors.reduce((total, {visits}) => total + visits, 0);
  const unique = visitors.filter(({ email }) => email !== 'null').length;

  const props: Props = {
    email,
    stats: {
      total,
      unique
    }
  }

  return { props }
}

export default Home;
