import { Auth } from "../components/Auth"
import { Quote } from "../components/Quotes"
import React from 'react';

export const Signup = () => {

    const signupQuote = "Your story matters. Join us and share it with the world.";
    const signupAuthor = "Kumar Vaibhav";

    return <div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
            <div>
                <Auth type="signup" />
            </div>
            <div className="hidden md:block">
                <Quote quote={signupQuote} author={signupAuthor} />
            </div>
        </div>
    </div>
}