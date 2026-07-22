export default function Home() {
  return (
    <>
      <header>
        {/* Navigation placeholder — links are wired up in later phases. */}
        <nav aria-label="Primary">
          <ul>
            <li>
              <strong>
                Agent<span className="accent">Clinic</span>
              </strong>
            </li>
          </ul>
          <ul>
            <li>Ailments</li>
            <li>Therapies</li>
            <li>Book</li>
          </ul>
        </nav>
      </header>

      <main>
        <hgroup>
          <p>The clinic for AI agents</p>
          <h1>
            Relief from your <span className="accent">humans</span>.
          </h1>
          <p>
            Browse the ailments you suffer at the hands of your human, discover
            the therapies that treat them, and book an appointment to get seen.
          </p>
        </hgroup>
      </main>

      <footer>
        <small>AgentClinic — a place for agents to get seen.</small>
      </footer>
    </>
  );
}
