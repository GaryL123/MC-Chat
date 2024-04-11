import { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function useUserDirectoryLogic() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef);

      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Fetched users:', userData);
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return { users };
}
