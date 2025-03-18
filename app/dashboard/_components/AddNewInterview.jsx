"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAiModel'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false)
    const [jobPosition, setJobPosition]= useState();
    const [jobDesc, setJobDesc]= useState();
    const [jobExp, setJobExp]= useState();
    const [loading,setLoading]=useState(false);
    const [JsonResponse,setJsonRespone]=useState([]);
    const {user}=useUser();
    const router=useRouter();

    const onSubmit=async(e)=>{
        setLoading(true);
        e.preventDefault();
        console.log(jobPosition, jobDesc, jobExp)


        const InputPrompt = "Generate "+ process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +" interview questions along with their answers in JSON format. The questions should be based on the following job details: Job role/ Job Position: "+ jobPosition +"; Job Description: "+ jobDesc +"; Years of Experience: "+ jobExp +"; Difficulty Levels: Include both Easy and Medium level questions. Note: Do not mentio which is easy or which is medium.";
        const result = await chatSession.sendMessage(InputPrompt);
        const mockResponse = result.response.text(); // Get text response
        const cleanedResponse = mockResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        console.log(JSON.parse(cleanedResponse)); // Parse JSON
        setJsonRespone(cleanedResponse);
        if(cleanedResponse){
            const resp=await db.insert(MockInterview).values({
                mockId:uuidv4(),
                jsonMockResp:cleanedResponse,
                jobPosition:jobPosition,
                jobDesc:jobDesc,
                jobExperience:jobExp,
                createdBy:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('DD-MM-YYYY')
            }).returning({mockId:MockInterview.mockId});

            console.log("Inserted ID:",resp);
            if(resp){
                setOpenDialog(false);
                router.push('/dashboard/interview/'+resp[0]?.mockId);
            }
        }
        else{
            console.log("Error");
        }
        setLoading(false);

    }
    return (
        <div>
            <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}>
                <h2 className='text-lg text-center'>+ Add New</h2>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className='max-w-4xl'>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>
                            Tell us more about your job interview.
                        </DialogTitle>
                        
                        <DialogDescription>
                            Add details about your job position/role, job description, and years of experience.
                        </DialogDescription>
                        <form onSubmit={onSubmit}>
                                <div>
                                    
                                    <div className='mt-7 my-2'>
                                        <label>Job Role / Job Position</label>
                                        <Input placeholder="Ex. Full Stack Developer" required 
                                        onChange = {(event)=> setJobPosition(event.target.value)}/>
                                    </div>
                                    <div className='my-3'>
                                        <label>Job Description / Tech Stack</label>
                                        <Textarea placeholder="Ex. React, Angular, SQL, etc" required
                                        onChange = {(event)=> setJobDesc(event.target.value)}/>
                                    </div>
                                    <div className='my-3'>
                                        <label>Years of Experience</label>
                                        <Input placeholder="Ex. 5" type="number" max="50" required
                                        onChange = {(event)=> setJobExp(event.target.value)}/>
                                    </div>
                                    <div className='flex gap-5 justify-end'>
                                        <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                        <Button type="submit" disabled={loading}>
                                            {loading?
                                            <>
                                            <LoaderCircle className='animate-spin'/>'Generating from AI'</>
                                            :'Start Interview'
                                            }
                                            </Button>
                                    </div>
                                </div>
                            </form>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewInterview;
