import { Auth } from "../components/Auth"
import { Quote } from "../components/Quotes"

export const Signin = () => {

    const signinQuote = "Welcome back! Sign in to continue sharing your thoughts.";
    const signinAuthor = "Kumar Vaibhav";

    return <div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
            <div>
                <Auth type="signin" />
            </div>
            <div className="hidden md:block">
                <Quote quote={signinQuote} author={signinAuthor} />
            </div>
        </div>
    </div>
}