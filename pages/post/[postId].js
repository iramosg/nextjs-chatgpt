import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function Post() {
  return <div>My page Post</div>
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  }
})
