import React, { FC, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTemplateListById } from "@/service/campaign";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
type propsType = {
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
};
const SelectedTemplate: FC<propsType> = ({ id, setId }) => {
  console.log("id", id);

  const { data: TemplateData } = useTemplateListById({ id });

  const [decodedHtml, setDecodedHtml] = useState("");

  useEffect(() => {
    // First decode the HTML entities
    const tempElement = document.createElement("div");
    tempElement.innerHTML = TemplateData?.content as string;
    const firstDecode = tempElement.textContent || "";

    // Then unescape any remaining encoded tags
    const finalHtml = firstDecode.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    setDecodedHtml(finalHtml);
  }, [TemplateData?.content]);

  // const decodeHtml = (html: string) => {
  //   const txt = document.createElement('textarea');
  //   txt.innerHTML = html;
  //   return txt.value;
  // };

  const decodeHtml = (html: string): string => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  console.log("TemplateData");
  console.log(TemplateData);
  return (
    <Dialog open={!!id} onOpenChange={() => setId("")}>
      <DialogContent className="mb-[10]  max-h-[40.6875rem]  lg:max-w-[950px] p-0 overflow-y-scroll">
        <DialogHeader className="border-lightGray bg-cultured h-[3.875rem] rounded-t-lg border-b text-left justify-center ">
          <DialogTitle className=" lg:p-[1.56rem] text-lg font-semibold leading-5 px-2">
            {/* Template Details */}
            {TemplateData?.templateName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-8">
          <Tabs defaultValue="immidiatly" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="immidiatly">Email</TabsTrigger>
              {/* <TabsTrigger value="setup" >Website</TabsTrigger> */}
              {/* <TabsTrigger value="later">Schedule Later</TabsTrigger> */}
            </TabsList>
            <TabsContent value="immidiatly" className="w-[890px]">
              <div>
                <div className="p-5" id="home" role="tabpanel">
                  {/* Phishing Email Select */}
                  <div className="flex flex-col md:flex-row mb-4 items-center">
                    <label className="w-full md:w-1/4 mb-2 md:mb-0">
                      Phishing Email
                    </label>
                    <div className="w-full md:w-3/4">
                      <input
                        type="text"
                        className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                        id="vaSubj"
                        // value={TemplateData?.senderName}
                        value={TemplateData?.templateName}
                        placeholder="Email Subject"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Email Subject */}
                  <div className="flex flex-col md:flex-row mb-4 items-center">
                    <label
                      htmlFor="esubj"
                      className="w-full md:w-1/4 mb-2 md:mb-0"
                    >
                      Email Subject
                    </label>
                    <div className="w-full md:w-3/4">
                      <input
                        type="text"
                        className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                        id="vaSubj"
                        value={TemplateData?.subject}
                        // placeholder="Email Subject"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Email Template Preview */}
                  <div id="vETAttachment">
                    <label className="w-full md:w-1/4 pb-8 text-lg font-bold text-default-600">
                      Content
                    </label>
                    <div
                      // ref={editorRef}
                      //contentEditable
                      dangerouslySetInnerHTML={{
                        __html: TemplateData?.content as string,
                      }}
                      // onInput={handleHtmlEdit}
                      className="h-[300px]  overflow-y-scroll"
                    />

                    {/* <div 
      className="ql-editor h-[250px]  overflow-y-scroll"
      dangerouslySetInnerHTML={{ __html: decodedHtml }}
    /> */}

                    {/* <div
  className="h-[250px] overflow-y-scroll"
  dangerouslySetInnerHTML={{
    __html: decodeHtml(TemplateData?.content || ''),
  }}
/> */}
                    {/* <div 
      className="ql-editor h-[250px]  overflow-y-scroll" // This class applies Quill's styles
      dangerouslySetInnerHTML={{ __html: TemplateData?.content as string }}
    /> */}
                  </div>
                  {/* {TemplateData?.image && (
        <div className="w-full max-w-4xl mx-auto mt-4">
        <small className="text-red-500 font-bold block mb-2">
          Note: The below image is just a screenshot.
        </small>
        <button 
          id="vaEmailLink" 
        //   onClick={() => showEmailTemplate("DocuSign-Sign-Document")}
          className="w-full focus:outline-none"
        >
          <img 
            id="vaEmailImage" 
            src={TemplateData?.image}
            alt="Email Template Preview" 
            className="w-full border border-gray-300 object-cover"
          />
        </button>
      </div>
      )} */}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="setup" className="w-[890px]">
              <div className="p-5 active show" id="profile" role="tabpanel">
                <div className="flex flex-col md:flex-row items-center md:items-start mb-4">
                  <label className="md:w-1/4 text-gray-700 font-medium">
                    Phishing Website
                  </label>
                  <div className="md:w-3/4 w-full">
                    <select
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                      id="vaWebsite"
                    >
                      {[
                        "Office365-Login",
                        "Google-Login",
                        "Dropbox-Login",
                        "LinkedIn-Login",
                        "Paypal-Login",
                        "Facebook-Login",
                        "CommBank-Login",
                        "Concur-Login",
                        "EBay-Login",
                        "Govia-Login",
                        "JIRA-Login",
                        "HSBC-Login",
                        "Bell-Canada-Login",
                        "FedEx-Login",
                        "Capital-One-Login",
                        "Verizon-Login",
                        "Generic-Login",
                        "DocuSign-Login",
                        "Zoom-Login",
                        "Netflix-Login",
                        "Canada-Post-Login",
                        "Instagram-Login",
                        "Qantas-Login",
                        "Uber-Login",
                        "Deliveroo-Login",
                        "Okta-Login",
                        "GitHub-Login",
                        "African-Bank-Login",
                        "Office365-MFA-Login",
                        "Slack-Login",
                        "STC-Login",
                        "AMEX-Login",
                        "ADCB-Login",
                        "Canada-Revenue-Login",
                        "Xero-Login",
                        "1Password-Login",
                        "Bitwarden-Login",
                        "Dashlane-Login",
                        "LastPass-Login",
                        "Stripe-Login",
                        "Zendesk-Login",
                        "Blank-Webpage",
                        "Microsoft-Login",
                        "OneLogin-Webpage",
                        "Jenkins-Login",
                        "Pento-Login",
                        "Udemy-Login",
                        "TikTok-Login",
                        "Adobe-Login",
                        "Bank-of-America-Login",
                        "Mercado-Libre-Login",
                        "User Awareness Training",
                        "Western-Union-Login",
                        "Venmo-Login",
                        "BambooHR-Login",
                        "Vanta-Login",
                        "Drata-Login",
                        "Apple-iCloud-Login",
                        "ADP-Login",
                        "Atlassian-Login",
                        "ClickUp-Login",
                        "GoDaddy-Login",
                        "Linkt-Login",
                        "Mailchimp-Login",
                        "Monday-Login",
                        "Quickbooks-Login",
                        "Shopify-Login",
                        "Square-Login",
                        "Zoho-Login",
                        "British-Airways-Login",
                        "Air-New-Zealand-Login",
                        "BNZ-Login",
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center md:items-start mb-4">
                  <label
                    htmlFor="wurl"
                    className="md:w-1/4 text-gray-700 font-medium"
                  >
                    Website URL
                  </label>
                  <div className="md:w-3/4 w-full">
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                      id="vaWURL"
                      placeholder="Website URL"
                      disabled
                    />
                  </div>
                </div>
                <div className="w-full md:w-4/5 mx-auto pt-4">
                  <small className="text-red-500 font-medium">
                    <b>Note:</b> The below image is just a screenshot. Click the
                    screenshot to see the live website.
                  </small>
                  <a
                    id="vaWebLink"
                    href="https://ae814d-docusign.alerting-services.com/8c5a0f578b?v=t&amp;c=c788e50f78&amp;p=18"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      id="vaWebImage"
                      src="https://d1yynrqd2fp86j.cloudfront.net/WebsiteTemplates/Screenshots/docusign.PNG"
                      alt="Phishing Website Screenshot"
                      className="w-full object-cover border border-gray-300 mt-2"
                    />
                  </a>
                </div>
              </div>
            </TabsContent>

            {/* <TabsContent value='later'>

      </TabsContent> */}
          </Tabs>
          <div className="flex justify-center">
            <Button
              className="text-white bg-purple-950 hover:bg-purple-700 p-4"
              onClick={() => setId("")}
            >
              <X className="text-white  " />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectedTemplate;
