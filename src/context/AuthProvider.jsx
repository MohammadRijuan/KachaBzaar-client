import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase.init';


const AuthProvider = ({children}) => {

    const GoogleProvider = new GoogleAuthProvider()

    const [user,setUser] = useState(null)
    const [loading,setloading] = useState(true)

    const createUser = (email,password)=>{
        setloading(true)
        return createUserWithEmailAndPassword(auth,email,password)
    }

    const SigninUser = (email,password)=>{
        setloading(true)
        return signInWithEmailAndPassword(auth,email,password)
    }

    const GoogleSignIn=()=>{
        setloading(true)
        return signInWithPopup(auth,GoogleProvider)
    }


    const SignOutUser = ()=>{
        setloading(true)
        return signOut(auth)
    }


    const updateUser = (updatedData)=>{
        setloading(true)
        return updateProfile(auth.currentUser,updatedData)
    }
    

    const userInfo={
        createUser,
        SigninUser,
        GoogleSignIn,
        SignOutUser,
        updateUser,
        loading,
        setloading,
        user,
        setUser
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            console.log('user in the auth state change', currentUser)
            setloading(false);
        });

        return () => {
            unSubscribe();
        }
    }, [])

    return (
        <div>
            <AuthContext value={userInfo}>
                {children}
            </AuthContext>
        </div>
    )
};

export default AuthProvider;