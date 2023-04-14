import { Button } from "@/components/Button";
import type { inferAsyncReturnType } from "@trpc/server";
import type { NextPage } from "next";
import { getProviders, getSession, signIn, useSession } from "next-auth/react";

type LoginProps = {
  providers?: inferAsyncReturnType<typeof getProviders>;
};

const Login: NextPage<LoginProps> = ({ providers }) => {
  const { data: sessionData } = useSession();

  if (sessionData) {
    window.location.href = "/";
    return null;
  }

  if (!providers) {
    return <h1>You are already logged in</h1>;
  }

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-zinc-900 p-10 text-zinc-200">
      {Object.values(providers).map((provider) => (
        <Button
          key={provider.id}
          onClick={() => {
            signIn(provider.id, { redirect: true, callbackUrl: "/" }).catch(
              console.error
            );
          }}
        >
          Log In with {provider.name}
        </Button>
      ))}
    </main>
  );
};

Login.getInitialProps = async ({ req, res }) => {
  const session = await getSession({ req: req });
  if (session && res) {
    res.writeHead(302, { location: "/" });
    res.end();
    return {};
  }

  const providers = await getProviders();
  return { providers };
};

export default Login;
