import {useState, useRef, useEffect} from 'react';

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
            <button className='sign-out transition ease-in-out duration-250 bg-primary p-3 rounded-xl font-abc font-bold drop-shadow-lg hover:scale-105 hover:bg-red-500' onClick={signInWithGoogle}>Sign In With Google</button>
        );
    }

    function SignOut(){
        return auth.currentUser && (
            <button className="sign-out transition ease-in-out duration-250 bg-primary p-3 rounded-xl font-abc font-bold drop-shadow-lg hover:scale-105 hover:bg-red-500" onClick={() => auth.signOut()}>Sign Out</button>
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
                <div className='messages-container'>
                    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                    <div ref={dummy}></div>
                </div>

            <form onSubmit={sendMessage}>
                <div className='bg-slate-900 rounded-lg p-3 mb-12 ml-10 mr-14'>
                    <input className="bg-slate-900 text-stone-50 pr-96" value={formValue} placeholder="Ask Plumi..." onChange={(e) => setFormValue(e.target.value)}/>
                    <button type='submit'>
                        <div className='scale-150 ml-5 pt-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6 pt-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                    </button>
                </div>
                
            </form>
            <div className='grid grid-cols-3 items-center'>
                <p className='font-abc col-start-1 col-end-1 font-bold'>Taking care of others, is the best way to take care of onself! You got this!</p>
                <SignOut className="col-start-3 col-end-3"/>
            </div>
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

    const [plumiTalk, setPlumiTalk] = useState("Welcome to Perennail!\n I'm Plumi, please upload an image or describe how well you work with routines!");

    useEffect(() => {
        fetch("/members").then(
            res => res.json()
        ).then(
            data => {
                setPlumiTalk(data)
            }
        )
    }, [])

    return(
        <div>
            <div class="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#242424_1px,transparent_1px),linear-gradient(to_bottom,#242424_1px,transparent_1px)] bg-[size:6rem_4rem]"><div class="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#00dd9e,transparent)]"></div></div>
            <span className='h-24 grid grid-cols-6 gap-0 p-5 pt-7'>
                <img className="drop-shadow-3xl col-start-1 col-end-1" style={{maxHeight:'32px', maxWidth:'192px'}} src="https://cdn.discordapp.com/attachments/656957416297988096/1236405752646729818/Typeface.png?ex=6637e416&is=66369296&hm=9ddd731e289981058111cf552aeecdb80784afb34a380012199d72335c0107d1&"/>
                <div className='col-start-6 col-end-6'>
                    <h3 className=' mt-1 font-abc font-extrabold text-primary'>Plumi the AI Plant...</h3>
                </div>
                
            </span>
        <div className="flex flex-1">
            <div className="w-1/3 p-4">
                <ImgUploader/>
            </div>
            <div className="flex-1 p-4">
                <section>
                    {user ? <ChatBox /> 
                    : <div className='flex justify-center items-center h-full'><SignIn/></div>}
                </section>
            </div>
        </div>
        </div>
    )
}

export default App;