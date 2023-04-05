import { useEffect, useState } from 'react'
import { app, db } from '../../firebaseConfig';
import { doc, getDoc, getDocs, collection, updateDoc, deleteDoc } from 'firebase/firestore'
import 'react-quill/dist/quill.snow.css';
import { dbInstance } from './NoteOperations';
import styles from '@/styles/Justnotes.module.scss'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const NoteDetails = (props: { ID: string }) => {
  const { ID } = props;
  const [singleNote, setSingleNote] = useState<{ id: string, noteTitle: string, noteContent: string } | null>(null)
  const [isEdit, setIsEdit] = useState(false);
  const [noteTitle, setNoteTitle] = useState<string | undefined>('');
  const [noteContent, setNoteContent] = useState<string | undefined>('');

  const getEditData = () => {
    setIsEdit(true);
    setNoteTitle(singleNote?.noteTitle);
    setNoteContent(singleNote?.noteContent)
  }

  const getNotes = () => {
    getDocs(dbInstance)
      .then((data) => {
        setSingleNote(data.docs.map((item) => {
          return { id: item.id, noteTitle: item.data().noteTitle, noteContent: item.data().noteContent }
        })[0]);
      })
  }

  const editNote = (id: string) => {
    const collectionById = doc(db, 'notes', id)

    updateDoc(collectionById, {
      noteTitle: noteTitle,
      noteContent: noteContent,
    })
      .then(() => {
        // setIsEdit(false);
        // getNotes();
        // Reload to also update the title in the sidebar
        window.location.reload()
      })
  }

  const deleteNote = (id: string) => {
    const collectionById = doc(db, 'notes', id)

    deleteDoc(collectionById)
      .then(() => {
        window.location.reload()
      })
  }

  useEffect(() => {
    getNotes();
  }, [])

  useEffect(() => {
    const getSingleNote = async () => {
      if (ID) {
        const singleNote = doc(db, 'notes', ID)
        const data = await getDoc(singleNote)
        setSingleNote({ id: data.id, noteContent: data.data()?.noteContent, noteTitle: data.data()?.noteTitle })
      }
    }
    getSingleNote();
  }, [ID])

  return (
    <div>
      {singleNote ?
        <>
          <div>
            <button className={styles.editBtn} onClick={getEditData}>Edit</button>
            <button className={styles.deleteBtn} onClick={() => deleteNote(singleNote.id)}>Delete</button>
          </div>
          <h2>{singleNote.noteTitle}</h2>
          <div dangerouslySetInnerHTML={{ __html: singleNote.noteContent }}></div>
          {isEdit ? (
            <div className={styles.inputContainer}>
              <input
                className={styles.input}
                placeholder='Enter the Title..'
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
              <div className={styles.ReactQuill}>
                <ReactQuill
                  value={noteContent}
                  onChange={(value) => setNoteContent((value))}
                />
              </div>
              <button
                className={styles.saveBtn}
                onClick={() => editNote(singleNote.id)}
              >
                Update Note
              </button>
            </div>
          ) : (
            <></>
          )}
        </>
      :
        <>
          <h2>No Note Selected</h2>
        </>  
      }
    </div>
  )
}

export default NoteDetails