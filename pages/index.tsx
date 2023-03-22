import Head from 'next/head'
import styles from '@/styles/Justnotes.module.scss'
import NoteOperations from './components/NoteOperations'
import NoteDetails from './components/NoteDetails'
import { useState } from 'react'

export default function Home() {
  const [ID, setID] = useState<string>('');

  const getSingleNote = (id: string) => {
    setID(id)
  }

  return (
    <div className={styles.mainContainer}>
      <Head>
        <title>Just Notes!</title>
        <meta name="description" content="This is a note app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.header}>Just Notes! - Create your notes for free</div>
        <div className={styles.container}>
          <div className={styles.left}>
            <NoteOperations getSingleNote={getSingleNote} />
          </div>
          <div className={styles.right}>
            <div className={styles.rightContent}>
              <NoteDetails ID={ID} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
