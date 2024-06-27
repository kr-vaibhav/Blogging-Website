interface QuoteProps{
    quote : string,
    author: string,
}

export const Quote = ({quote,author}: QuoteProps)=>{

    return (
        <div className="bg-gray-300 h-screen flex justify-center flex-col">


            <div className="flex justify-center">
                <div className="max-w-lg">

                    <div className="text-3xl font-bold">
                    {quote}
                    </div>
                    <div className="max-w-md text-xl font-semibold text-left text-slate-700 mt-4">
                        {author}
                    </div>
                </div>
            </div>

        </div>
    )

}