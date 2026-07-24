import Link from 'next/link'

export default function NotFound() {
  return (
    <main>
      <hgroup>
        <h1>No such therapy</h1>
        <p>That treatment isn&rsquo;t on the clinic&rsquo;s books.</p>
      </hgroup>
      <p>
        <Link href="/therapies">Back to all therapies</Link>
      </p>
    </main>
  )
}
