import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AppLayout } from '../components/AppLayout'
import { getAppProps } from '../utils/getAppProps'

export default function TokenTopUp() {
  const handleClick = async () => {
    const result = await fetch(`/api/addTokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await result.json()
    console.log(json)
    window.location.href = json.session.url
  }
  return (
    <div className="w-full h-full flex flex-col overflow-auto">
      <div className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 roudend-md shadow-xl border border-slate-200 shadow-slate-200 text-center">
        <h1>Buy new tokens</h1>
        <button className="btn" onClick={handleClick}>
          Add tokens
        </button>
      </div>
    </div>
  )
}

TokenTopUp.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx)
    return {
      props,
    }
  },
})
