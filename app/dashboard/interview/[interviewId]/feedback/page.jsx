"use client";
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';


function feedback({ params }) {

    const [feedbackList, setFeedbackList] = useState([]);
    const [overallRating, setOverallRating] = useState(null);
    const router = useRouter();

    useEffect(() => {
        GetFeedback();
    }, [])

    const GetFeedback = async () => {
        const result = await db.select()
            .from(UserAnswer)
            .where(eq(UserAnswer.mockIdRef, params.interviewId))
            .orderBy(UserAnswer.id);

        console.log(result);
        setFeedbackList(result);

        // 🔹 Calculate the overall rating
        if (result.length > 0) {
            const totalRating = result.reduce((sum, item) => sum + (parseFloat(item.rating) || 0), 0);
            const avgRating = (totalRating / result.length).toFixed(1); // Rounded to 1 decimal place
            setOverallRating(avgRating);
        } else {
            setOverallRating("N/A");
        }
    }

    return (
        <div className='p-10'>
            
            {feedbackList?.length == 0 ? (
                <h2 className='font-bold text-xl text-grey-500'>No interview feedback record found.</h2>
            ) : (
                <>
                    <h2 className='text-2xl font-bold text-green-500'>Congratulations...</h2>
                    <h2 className='font-bold text-2xl'>Here is your interview feedback.</h2>
                    
                    {/* 🔹 Display the actual overall rating */}
                    <h2 className='text-primary text-lg my-3'>
                        Your overall interview rating: <strong>{overallRating}/10</strong>
                    </h2>

                    <h2 className='text-sm text-gray-500'>
                        Find below the interview question with correct answer, your answer, and feedback for improvement.
                    </h2>
                    
                    {feedbackList.map((item, index) => (
                        <Collapsible key={index} className='mt-7'>
                            <CollapsibleTrigger className='p-2 bg-secondary flex justify-between rounded-lg my-2 w-full text-left gap-7'>
                                {item.question} <ChevronsUpDown className='h-5 w-5'/>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-red-500 p-2 border rounded-lg'>
                                        Rating: <strong>{item.rating} </strong>
                                    </h2>
                                    <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'>
                                        <strong>Your Answer: </strong>{item.userAns}
                                    </h2>
                                    <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'>
                                        <strong>Correct Answer: </strong>{item.correctAnswer}
                                    </h2>
                                    <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'>
                                        <strong>Feedback: </strong>{item.feedback}
                                    </h2>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </>
            )}

            <Button onClick={() => router.replace('/dashboard')}>Go Home</Button>
        </div>
    )
}

export default feedback;
