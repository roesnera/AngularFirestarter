import { Injectable, inject } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { Firestore, collection, collectionData, 
  addDoc, deleteDoc, doc, updateDoc, arrayRemove, 
  query, where, orderBy, WriteBatch, writeBatch, getDoc } from '@angular/fire/firestore';
import { Board, BoardToWrite, Task } from './board.model';
import * as firebase from 'firebase/compat';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  db: Firestore = inject(Firestore);

  constructor(private auth: AuthService) { }

  /* Create a new board for the current user */
  
  async createBoard(data: Board) {
    const user = this.auth.afAuth.currentUser;
    const boards = collection(this.db, 'boards');
    const boardToCreate: BoardToWrite = {
      ...data,
      uid: user?.uid,
      tasks: [{description: "Hello!", label: "yellow"}]
    }
    return await addDoc(boards, boardToCreate)
  }

  /* Delete board */

  async deleteBoard(boardId: string) {
    const boardReference = doc(this.db, "boards/"+boardId);
    return await deleteDoc(boardReference);
  }

  async updateTasks(boardId: string, tasks: Task[]) {
    const boardReference = doc(this.db, "boards/"+boardId);
    console.log('successully got board reference');
    return await updateDoc(boardReference, 'tasks', tasks);
  }

  async removeTask(boardId: string, task: Task) {
    const boardToUpdate = doc(this.db, "boards/"+boardId);
    return await updateDoc(boardToUpdate, 'tasks', arrayRemove(task));
  }
  
  /* Get all user's boards */
  getUserBoards() {
    const uid = this.auth.afAuth.currentUser?.uid;
    const allBoards = collection(this.db, 'boards');
    const collectionQuery = query(allBoards, where("uid", "==", uid), orderBy("priority"))
    const userBoards = collectionData(collectionQuery, { idField: "id" });
    return userBoards;
  }

  sortBoards(boards: Board[]){
    try {
      const batch = writeBatch(this.db);
      const boardsRef = collection(this.db, 'boards');
      // console.log(boards);
      const refs = boards.map(b => doc(boardsRef, b.id));
      refs.forEach((ref, index) => {
        // console.log(ref, index);
        batch.update(ref, 'priority', index);
      });
      batch.commit();
    } catch (e) {
      console.log("Error in sortBoards: ", e);
    }
  }
}
