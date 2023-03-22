import { useEffect, useState } from 'react'
import styles from '../../styles/Justnotes.module.scss'
import { app, db } from '../../firebaseConfig'
import { collection, addDoc, getDocs } from 'firebase/firestore'
// import ReactQuill from 'react-quill'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

export const dbInstance = collection(db, 'notes')

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


const NoteOperations = (props: { getSingleNote: (id: string) => void }) => {
  const [isInputVisible, setIsInputVisible] = useState(false)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [notesArray, setNotesArray] = useState<{ id: string, noteTitle: string, noteContent: string }[]>([])

  const saveNote = () => [
    addDoc(dbInstance, {
      noteTitle: noteTitle,
      noteContent: noteContent,
    })
      .then(() => {
        setNoteTitle('')
        setNoteContent('')
        getNotes()
      }),
  ]

  const addContent = (value: string) => {
    setNoteContent(value)
  }

  const getNotes = () => {
    getDocs(dbInstance)
      .then((data) => {
        setNotesArray(data.docs.map((item) => {
          return { id: item.id, noteTitle: item.data().noteTitle, noteContent: item.data().noteContent }
        }));
      })
  }

  useEffect(() => {
    getNotes();
  }, [])

  return (
    <>
      <div className={styles.btnContainer}>
        <button
          className={styles.button}
          onClick={() => setIsInputVisible(prev => !prev)}
        >
          Add a New Note
        </button>
      </div>
      {isInputVisible && (
        <div className={styles.inputContainer}>
          <input
            className={styles.input}
            type="text"
            placeholder="Enter Note title..."
            onChange={e => setNoteTitle(e.target.value)}
            value={noteTitle}
          />
          <div className={styles.ReactQuill}>
            <ReactQuill
              onChange={addContent}
              value={noteContent}
            />
          </div>
          <button
            className={styles.saveBtn}
            onClick={saveNote}
          >
            Save Note
          </button>
        </div>
      )}
      <div className={styles.notesDisplay}>
        {notesArray.map((note, key) => {
          const { id, noteTitle } = note
          return (
            <div
              className={styles.notesInner}
              onClick={() => props.getSingleNote(id)}
              key={key}
            >
              <h3>{noteTitle}</h3>
              {/* <div dangerouslySetInnerHTML={{ __html: note.noteContent }}></div> */}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default NoteOperations