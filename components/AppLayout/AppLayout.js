import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0/client'

export const AppLayout = ({ children }) => {
  const { user } = useUser()
  return (
    <div>
      <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
        <div className="flex flex-col text-white overflow-hidden">
          <div className="bg-slate-800">
            <div>Logo</div>
            <div>CTA</div>
            <div>Tokens</div>
          </div>
          <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
            List of Posts
          </div>
          <div className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2">
            {!!user ? (
              <>
                <div className="min-w-[50px]">
                  <Image
                    src={user.picture}
                    alt={user.name}
                    height={50}
                    width={50}
                    className="rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-bold">{user.email}</div>
                  <Link href="/api/auth/logout" className="text-sm">
                    Logout
                  </Link>
                </div>
              </>
            ) : (
              <Link href="/api/auth/login">Login</Link>
            )}
          </div>
        </div>

        <div className="">{children}</div>
      </div>
    </div>
  )
}
