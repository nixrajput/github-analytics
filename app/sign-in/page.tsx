import { signIn } from '@/auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const { callbackUrl } = await searchParams;
  // Auth.js's redirect callback drops any callbackUrl on another origin.
  const redirectTo = typeof callbackUrl === 'string' ? callbackUrl : '/';

  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>GitHub Analytics Dashboard</CardTitle>
          <CardDescription>
            Sign in with GitHub to view statistics. Requests use your own
            GitHub token, and other users&apos; stats show public data only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              'use server';
              await signIn('github', { redirectTo });
            }}
          >
            <Button type="submit" className="w-full">
              Sign in with GitHub
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
