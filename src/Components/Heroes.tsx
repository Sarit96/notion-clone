import React, { useState } from 'react';
import { ArrowRight } from "./Icons"
import heroesSvg from "../Svg/heroesSvg.svg"
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeroesProps {
    onLoginClick: () => void;
}

export default function Heroes({ onLoginClick }: HeroesProps) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleEnterNotion = async () => {
        if (isAuthenticated) {
            setIsLoading(true);
            try {
                // Simulate a small delay for the spinner to be visible
                await new Promise(resolve => setTimeout(resolve, 1000));
                navigate('/workspace');
            } finally {
                setIsLoading(false);
            }
        } else {
            onLoginClick();
        }
    };

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
                    <button
                        onClick={handleEnterNotion}
                        disabled={isLoading}
                        className="group bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-lg inline-flex items-center justify-center transition-all duration-300 hover:bg-black/90 dark:hover:bg-white/90 shadow-md hover:shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-md"
                    >
                        <div className="flex items-center">
                            {isLoading ? (
                                <>
                                    <svg 
                                        className="animate-spin h-5 w-5 mr-3" 
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                    >
                                        <circle 
                                            className="opacity-25" 
                                            cx="12" 
                                            cy="12" 
                                            r="10" 
                                            stroke="currentColor" 
                                            strokeWidth="4"
                                        />
                                        <path 
                                            className="opacity-75" 
                                            fill="currentColor" 
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    <span className="font-semibold text-lg">Entering...</span>
                                </>
                            ) : (
                                <>
                                    <span className="font-semibold text-lg">Enter Notion</span>
                                    <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-all duration-300" />
                                </>
                            )}
                        </div>
                    </button>
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
