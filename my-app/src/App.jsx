import {useState, useRef} from 'react';

import ImgUploader from './imgUploader';

import * as firebase from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import './App.css';

const firebaseConfig = {
    apiKey: "AIzaSyDB9pFOmyLn8bzCGSi4_ZCBZ5jqDWDcSwI",
    authDomain: "perennail-data.firebaseapp.com",
    projectId: "perennail-data",
    storageBucket: "perennail-data.appspot.com",
    messagingSenderId: "417681469490",
    appId: "1:417681469490:web:ecc39644a8dce3cab2cc2b"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

function SignIn()
    {

        const signInWithGoogle = () => {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider);
        }

        return(
            <button className='sign-in' onClick={signInWithGoogle}>Sign In With Google</button>
        );
    }

    function SignOut(){
        return auth.currentUser && (
            <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
        )
    }

function ChatBox()
{

    const dummy = useRef();
    const messagesRef = collection(firestore, 'messages');
    const messagesQuery = query(messagesRef, orderBy('createdAt'), limit(25));

    const [messages] = useCollectionData(messagesQuery, {idField: 'id'});
    const [formValue, setFormValue] = useState('');

    const sendMessage = async(e) => {
        e.preventDefault(); // Stops page from instantly refreshing the page

        const {uid, photoURL} = auth.currentUser;

        await addDoc(messagesRef, {
            text: formValue,
            createdAt: serverTimestamp(),
            uid,
            photoURL
        });

        setFormValue('');
        dummy.current.scrollIntoView({ behaviour: 'smooth'});
    }

    return(
        <>
            <SignOut/>
                <div className='messages-container'>
                    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                    <div ref={dummy}></div>
                </div>

            <form onSubmit={sendMessage}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
                <button type='submit'>Send</button>
            </form>
        </>
    )
}

function ChatMessage(props)
{
    const {text, uid, photoURL} = props.message;

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';


    return(
        <div className={`message ${messageClass}`}>
            <img src={photoURL} alt="User Photo" />
            <p>{text}</p>
        </div>
    )
}

function App()
{

    const [user] = useAuthState(auth);

    return(
        <div>
            <span style={{maxHeight:'120px', display:"flex"}}>
                <img style={{maxHeight:'120px', maxWidth:'720px'}} src="https://cdn.discordapp.com/attachments/656957416297988096/1236405752646729818/Typeface.png?ex=6637e416&is=66369296&hm=9ddd731e289981058111cf552aeecdb80784afb34a380012199d72335c0107d1&"/>
                <h3>Get help from Plumi the Plant!</h3>
            </span>
        <div className="page">
            <div className="leftSide">
                <ImgUploader/>
            </div>
            <div className="rightSide">
                <section>
                    {user ? <ChatBox /> : <SignIn/>}
                </section>
            </div>
        </div>
        </div>
    )
}

export default App;