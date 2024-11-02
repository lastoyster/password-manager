import './App.css';
import { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';

function App() {
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [passwordList, setPasswordList] = useState([]);

  // Fetch passwords on component mount
  const fetchPasswords = useCallback(async () => {
    try {
      const response = await Axios.get('http://localhost:3001/showpasswords');
      setPasswordList(response.data);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  }, []);

  useEffect(() => {
    fetchPasswords();
  }, [fetchPasswords]);

  // Add new password entry
  const addPassword = async () => {
    try {
      await Axios.post('http://localhost:3001/addpassword', {
        password,
        title,
      });
      setPassword('');
      setTitle('');
      fetchPasswords(); // Refresh list after adding
    } catch (error) {
      console.error('Error adding password:', error);
    }
  };

  // Decrypt password
  const decryptPassword = async (encryption) => {
    try {
      const response = await Axios.post(
        'http://localhost:3001/decryptpassword',
        {
          password: encryption.password,
          iv: encryption.iv,
        }
      );

      setPasswordList((prevList) =>
        prevList.map((val) =>
          val.id === encryption.id ? { ...val, title: response.data } : val
        )
      );
    } catch (error) {
      console.error('Error decrypting password:', error);
    }
  };

  return (
    <div className="App">
      <div className="AddingPassword">
        <input
          type="text"
          placeholder="Ex. password123"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <input
          type="text"
          placeholder="Ex. Facebook"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button onClick={addPassword}>Add Password</button>
      </div>

      <div className="Passwords">
        {passwordList.map((val) => (
          <div
            className="password"
            onClick={() =>
              decryptPassword({
                password: val.password,
                iv: val.iv,
                id: val.id,
              })
            }
            key={val.id}
          >
            <h3>{val.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
