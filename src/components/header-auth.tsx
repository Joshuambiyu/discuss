'use client';

import {
  NavbarItem,
  Button,
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@nextui-org/react';
import { useSession, signOut as clientSignOut } from 'next-auth/react';
import * as actions from '@/actions';
import { useRouter } from 'next/navigation';

export default function HeaderAuth() {
  const session = useSession();
  const router = useRouter();

  let authContent: React.ReactNode;
  if (session.status === 'loading') {
    authContent = null;
  } else if (session.data?.user) {
    authContent = (
      <Popover placement="left">
        <PopoverTrigger>
          <Avatar src={session.data.user.image || ''} />
        </PopoverTrigger>
        <PopoverContent>
          <div className="p-4">
            <Button 
              onClick={async () => {
                try {
                  await clientSignOut({ redirect: false });
                  await actions.signOut();
                  router.refresh();
                } catch (error) {
                  console.error('Sign out error:', error);
                }
              }}
            >
              Sign Out
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  } else {
    authContent = (
      <>
        <NavbarItem>
          <Button
            color="secondary"
            variant="bordered"
            onClick={async () => {
              try {
                await actions.signIn();
                router.refresh();
              } catch (error) {
                console.error('Sign in error:', error);
              }
            }}
          >
            Sign In
          </Button>
        </NavbarItem>

        <NavbarItem>
          <Button
            color="primary"
            variant="flat"
            onClick={async () => {
              try {
                await actions.signIn();
                router.refresh();
              } catch (error) {
                console.error('Sign up error:', error);
              }
            }}
          >
            Sign Up
          </Button>
        </NavbarItem>
      </>
    );
  }

  return authContent;
}
