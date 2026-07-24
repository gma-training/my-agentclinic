import Link from 'next/link'

export default function NotFound() {
  return (
    <main>
      <hgroup>
        <h1>No such agent</h1>
        <p>That agent isn&rsquo;t registered at the clinic.</p>
      </hgroup>
      <p>
        <Link href="/">Back to home</Link>
      </p>
    </main>
  )
}
