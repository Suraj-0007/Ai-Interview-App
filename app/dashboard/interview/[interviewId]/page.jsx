"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

function Interview({ params }) {
  const [interviewData, setInterviewData] = useState(null); // Initially null
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (!params?.interviewId) return; // Prevent errors if no interviewId
    GetInterviewDetails();
  }, [params?.interviewId]);

  // Function to get interview details
  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      if (result.length > 0) {
        setInterviewData(result[0]); // Store the interview data
      } else {
        console.error("No interview found with this ID.");
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle webcam errors
  const handleUserMedia = () => setWebCamEnabled(true);
  const handleUserMediaError = () => setWebCamEnabled(false);

  if (loading) return <p>Loading interview details...</p>; // Show loading state
  if (!interviewData) return <p>No interview found.</p>; // Handle missing interview

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's get Started.</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10"> 
        
          <div className="flex flex-col my-5 gap-5 ">
            <div className="flex flex-col gap-5 p-5 rounded-lg border">
              <h2 className="text-lg">
                <strong>Job Role/Job Position: </strong>
                {interviewData?.jobPosition}
              </h2>
              <h2 className="text-lg">
                <strong>Job Description: </strong>
                {interviewData?.jobDesc}
              </h2>
              <h2 className="text-lg">
                <strong>Years Of Experience: </strong>
                {interviewData?.jobExperience}
              </h2>
            </div>


            <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-50">
              <h2 className="flex gap-2 items-center text-yellow-500"><Lightbulb/><strong>Information</strong></h2>
              <h2 className="mt-3 text-yellow-500">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
            </div>
        </div>
        <div>
          {webCamEnabled ? (
            <Webcam
              onUserMedia={handleUserMedia}
              onUserMediaError={handleUserMediaError}
              mirrored={true}
              style={{ height: 300, width: 300 }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button variant="ghost" className="w-full"onClick={() => setWebCamEnabled(true)}>
                Enable Webcam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end items-end">
          <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
            <Button>Start Interview</Button>
          </Link>
      </div>
      
    </div>
  );
}

export default Interview;
