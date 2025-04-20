import React from 'react';
import { ArrowRight } from "./Icons"
import heroesSvg from "../Svg/heroesSvg.svg"

export default function Heroes() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 bg-gradient-to-b from-background via-background to-gray-100/50 dark:to-gray-900/30">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                    Your Ideas, Documents, &<br />
                    Plans. Unified. Welcome
                    <br />
                    to <span className="underline">Notion</span>
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                    Notion is the connected workspace where
                    <br />
                    better, faster work happens.
                </p>
                <div className="mt-8">
                    <a
                        href="#"
                        className="group bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-lg inline-flex items-center justify-center transition-all duration-300 hover:bg-black/90 dark:hover:bg-white/90 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-background"
                    >
                        <span className="font-semibold text-lg">Enter Notion</span>
                        <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-all duration-300" />
                    </a>
                </div>

                <div className="mt-16 flex justify-center">
                    <img
                        src={heroesSvg}
                        alt="Notion Hero Illustration"
                        className="w-full max-w-3xl h-auto"
                    />
                </div>
            </div>
        </div>
    )
}
