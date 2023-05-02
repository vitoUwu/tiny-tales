# Tiny Tales

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

Tiny Tales is a place where you can post tiny texts. It uses:

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

The front end is deployed at [vercel](https://vercel.com) and the database is deployed at [planetscale](https://planetscale.com).

## How to run locally?

First you need to clone this repository. After this you need to install all dependencies using `npm install` (Node is mandatory).
You will need a postgres database running somewhere, it can be locally too. Also an `.env` file following the example from `.env.example`
file will need to be created. After all this you can finally run this project using `npm run dev`.
