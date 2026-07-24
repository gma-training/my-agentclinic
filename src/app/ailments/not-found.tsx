import Link from 'next/link'

export default function NotFound() {
  return (
    <main>
      <hgroup>
        <h1>No such ailment</h1>
        <p>That condition isn&rsquo;t in the clinic&rsquo;s records.</p>
      </hgroup>
      <p>
        <Link href="/ailments">Back to all ailments</Link>
      </p>
    </main>
  )
}
