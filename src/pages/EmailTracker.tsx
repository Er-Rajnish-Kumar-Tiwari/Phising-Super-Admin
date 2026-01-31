// import { useGetEmailTracking } from '@/service/employee';
// import React, { useEffect } from 'react'
import { useGetEmailTracking } from '@/service/employee';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const EmailTracker = () => {
    const [searchParams] = useSearchParams();

    const email = searchParams.get('email');
    const link=`http://195.35.21.108:5173/tracking/email-click?email=${email}`
    // const link = searchParams.get('link');
  
    // Conditionally enable the query only if both params exist
    const {
    isRefetching
    } = useGetEmailTracking(
      {email:email || '',link:link},
      // { email: email || '', link: window.location.origin },
      { enabled: !!email && !!link} // Only enable if both exist
    );  
  
  // useEffect(() => {
  //   // Get the query parameters
  //   // const email = searchParams.get('email');
  //   // const link = searchParams.get('link');
  //   if(email && link){
  //     refetch()
  //   }
  //   console.log(`Tracking email: ${email}`);
    
    
  // }, [email]);
  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-16 relative">
        {/* Title */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Oops! That was a phishing website!
          </h1>
          <p className="text-xl text-gray-600">
            This was an approved phishing simulation run as part of a security awareness training exercise.
          </p>
        </div>
        {/* End Title */}

        <div className="flex flex-col lg:flex-row justify-between gap-8 mb-8">
          {/* Info Section */}
          <div className="lg:w-5/12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                What is phishing?
              </h2>
              <p className="mb-4 text-gray-700">
                Phishing is a type of social engineering attack often used to steal user data (e.g. login credentials and credit card numbers) or compromise computer networks. It occurs when an attacker, masquerades as a trusted entity and entices their recipients into opening an email, instant message, or text message.
              </p>
              <p className="mb-4 text-gray-700">
                Phishing attacks remain among the most common method used by malicious cyber actors to target businesses. While phishing messages are commonly sent out in their thousands, spear-phishing campaigns are typically aimed at a particular group of recipients.
              </p>
             
            </div>
          </div>

          {/* Video Section */}
          <div className="lg:w-7/12 -mr-12">
            <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
              <video 
                className="absolute top-0 left-0 w-full h-full" 
                controls
                crossOrigin="anonymous"
              >
                <source 
                  src="https://d3p8e1mvy30w84.cloudfront.net/videos/employee-phishing-training.mp4" 
                  type="video/mp4" 
                />
                <track 
                  kind="subtitles" 
                  src="https://d3p8e1mvy30w84.cloudfront.net/videos/employee-phishing-training-EN.vtt" 
                  srcLang="en" 
                  label="English" 
                />
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailTracker