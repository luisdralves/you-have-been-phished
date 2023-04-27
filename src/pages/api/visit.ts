import type { NextApiHandler} from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  const email = req.body.email as string ?? 'null';

  const visitor = await prisma.visitor.findUnique({
    where: { email }
  });

  const previousVisits = visitor?.visits ?? 0
  const result = await prisma.visitor.upsert({
    where: { email },
    create: {
      email,
      visits: 1
    },
    update: {
      visits: previousVisits + 1
    }
  });

  res.status(200).json(result);
};

export default handler;
