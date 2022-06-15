import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Visualize Spotify</title>
        <meta name="description" content="Visualize your music tastes relative to the rest of the world" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Visualize Music Tastes
        </h1>

        <Link href="/api/pre-auth">
          <button className={styles.button}>
            Get Started
          </button>
        </Link>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/austinmccalley"
          target="_blank"
          rel="noopener noreferrer"
        >
          Austin McCalley © {new Date().getFullYear()}
        </a>
      </footer>
    </div>
  )
}

export default Home
