import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  // Create new home
  if (req.method === 'POST') {
    try {
      const session = await getSession({ req });

      if (!session) {
        return res.status(401).json({ message: 'Unauthorized.' });
      }

      const { image, title, description, price, guests, beds, baths } =
        req.body;

      // Retrieve the current authenticated user
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      const home = await prisma.home.create({
        data: {
          ownerId: user.id,
          image,
          title,
          description,
          price,
          guests,
          beds,
          baths,
        },
      });

      res.status(200).json(home);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
  // HTTP method not supported!
  else {
    res.setHeader('Allow', ['POST']);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
