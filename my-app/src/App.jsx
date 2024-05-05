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

    const defaultPhotoURL = "https://cdn.discordapp.com/attachments/656957416297988096/1236496842670473256/Logo.png?ex=663838ec&is=6636e76c&hm=3f8cd470e3aee15b9fad9f550ab3045827d30588e527b04c5292bd041c236b55&"

    return(
        <div className={`message ${messageClass} overflow-auto`}>
            <div className="transition duration-250 ease-in-out box-border min-h-32 p-4 mx-10 my-3 border-4 bg-green-200 border-black rounded-3xl flex items-center shadow-lg hover:scale-105">
                <div className='bg-orange-100 rounded-full drop-shadow-md h-20 w-20 flex justify-center items-center border-slate-950 border-4 flex-shrink-0'>
                    <img src={photoURL || defaultPhotoURL} alt="User Photo" className='h-16 w-16 rounded-full border-solid drop-shadow-lg'/>
                </div>
                <div className='ml-3 flex-1 max-w-full md:max-w-[calc(100%-5rem)]'>
                    <div className="font-sans font-extrabold font-abc text-lg">{photoURL ? <p>You</p> : <p>Plumi</p>}</div>
                    <p className='font-abc font-light whitespace-pre-wrap break-words text-sm'>{text}</p>
                </div>
            </div>
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