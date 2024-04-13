import { useEffect, useState } from 'react'
import { useAuth } from './authContext'
import { collection, doc, getDoc, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { blurhash, getChatId, formatDate } from './commonLogic';

const roomsLogic = () => {

    const changeRoomPicture = async () => {
        
    };

    return {  };
}

export default roomsLogic;
