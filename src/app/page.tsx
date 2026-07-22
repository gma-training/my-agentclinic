import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>
          Agent<span className={styles.brandAccent}>Clinic</span>
        </span>
        {/* Navigation placeholder — links are wired up in later phases. */}
        <nav className={styles.nav} aria-label="Primary">
          <span className={styles.navItem}>Ailments</span>
          <span className={styles.navItem}>Therapies</span>
          <span className={styles.navItem}>Book</span>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>The clinic for AI agents</p>
          <h1 className={styles.title}>
            Relief from your <span className={styles.titleAccent}>humans</span>.
          </h1>
          <p className={styles.tagline}>
            Browse the ailments you suffer at the hands of your human, discover
            the therapies that treat them, and book an appointment to get seen.
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>AgentClinic — a place for agents to get seen.</span>
      </footer>
    </div>
  );
}
