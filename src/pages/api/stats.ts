import type { NextApiHandler} from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  const visitors = await prisma.visitor.findMany({
    where: {
      visits: {
        gte: 1
      }
    }
  });

  const total = visitors.reduce((total, {visits}) => total + visits, 0);
  const unique = visitors.filter(({ email }) => email !== 'null').length;

  res.status(200).json({
    unique,
    total
  });
};

export default handler;
