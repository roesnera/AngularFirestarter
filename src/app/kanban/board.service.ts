import { Injectable, inject } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { Firestore, collection, collectionData, 
  addDoc, deleteDoc, doc, updateDoc, arrayRemove, query, where, orderBy, WriteBatch, writeBatch, getDoc } from '@angular/fire/firestore';
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
    const boardReference = doc(this.db, boardId);
    return await deleteDoc(boardReference);
  }

  async updateTasks(boardId: string, tasks: Task[]) {
    const boardReference = doc(this.db, boardId);
    return await updateDoc(boardReference, 'tasks', tasks);
  }

  async removeTask(boardId: string, task: Task) {
    const boardToUpdate = doc(this.db, boardId);
    return await updateDoc(boardToUpdate, 'tasks', arrayRemove(task));
  }
  
  /* Get all user's boards */
  getUserBoard() {
    const uid = this.auth.afAuth.currentUser?.uid;
    if(uid) {
      const allBoards = collection(this.db, 'boards');
      const collectionQuery = query(allBoards, where("uid", "==", uid), orderBy("priority"))
      const userBoards = collectionData(collectionQuery);
      return userBoards;
    } else {
      return [];
    }
  }

  sortBoards(boards: Board[]){
    const batch = writeBatch(this.db);
    const boardsRef = collection(this.db, 'boards');
    const refs = boards.map(b => doc(boardsRef, b.id));
    refs.forEach((ref, index) => batch.update(ref, {priority: index}));
  }
}
