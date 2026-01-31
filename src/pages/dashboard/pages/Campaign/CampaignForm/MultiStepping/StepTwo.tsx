import { Button } from "@/components/ui/button";
import React, { JSX, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Check, X } from "lucide-react";
import {
  useAddTemplate,
  useGenerateTemplate,
  useTemplateList,
  useUploadImageTemplate,
} from "@/service/campaign";
import SelectedTemplate from "./SelectedTemplate";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SelectComponent } from "@/components/SelectComponet";
import { FaEye } from "react-icons/fa";
import {
  AIValidationSchema,
  Category,
  Industy,
  options,
  Tone,
  SelectStyles,
} from "./constant";
import parse from "html-react-parser";

interface StepProps {
  register: any;
  errors: any;
  setValue: any; // Add setValue to handle checkbox changes
  watch: any; // Add watch to observe checkbox values
  getValues: any;
}

type EmailTemplate = {
  userId: string;
  htmlBody: string;
  placeholders: string[];
  category: string;
  subject: string;
  templateName: string;
  contentLength: number;
  lengthCategory: "short" | "medium" | "long"; // Assuming possible values are short/medium/long
};

export const templateSchema = yup.object().shape({
  templateName: yup.string().required("Template name is required"),
  content: yup.string().required("Content is required"),
  placeholders: yup.string(),
  subject: yup.string().required("Subject is required"),
  image: yup.string().url("Image must be a valid URL"),
  maualcategory: yup
    .object()
    .shape({
      label: yup.string().required("Select the category"),
      value: yup.string().required("Select the category"),
    })
    .required("Select the category"),
  ctaType: yup
    .object()
    .shape({
      value: yup.string().required("Select cta type"),
      label: yup.string().required("Select cta type"),
    })
    .required("Select cta type"),
  customText: yup.string().when("ctaType", {
    is: (val: { value: string }) => val?.value === "others",
    then: () =>
      yup
        .string()
        .required('Custom text is required when "Others" is selected')
        .max(10, "Maximum 10 characters allowed"),
  }),
});

const phishingCategories = [
  { label: "All", value: "all" },
  { label: "Credential Harvesting", value: "Credential Harvesting" },
  { label: "Business Email Compromise", value: "Business Email Compromise" },
  {
    label: "Fake Invoice / Payment Request",
    value: "Fake Invoice / Payment Request",
  },
  { label: "HR & Internal Memos", value: "HR & Internal Memos" },
  { label: "IT Support / Helpdesk", value: "IT Support / Helpdesk" },
  { label: "Social Media Alerts", value: "Social Media Alerts" },
  {
    label: "Delivery / Shipment Notification",
    value: "Delivery / Shipment Notification",
  },
  { label: "Fake Job Offers", value: "Fake Job Offers" },
  { label: "Contest & Giveaway Scams", value: "Contest & Giveaway Scams" },
  { label: "Bank / Financial Alerts", value: "Bank / Financial Alerts" },
  { label: "Software Update Required", value: "Software Update Required" },
  {
    label: "Security Alert / Account Suspension",
    value: "Security Alert / Account Suspension",
  },
  { label: "COVID-19 / Health Alerts", value: "COVID-19 / Health Alerts" },
  { label: "CEO Fraud / Urgent Request", value: "CEO Fraud / Urgent Request" },
  { label: "Shared Document Access", value: "Shared Document Access" },
  {
    label: "Subscription / Renewal Scams",
    value: "Subscription / Renewal Scams",
  },
  {
    label: "E-commerce Order Confirmation",
    value: "E-commerce Order Confirmation",
  },
  { label: "Cloud Storage Access", value: "Cloud Storage Access" },
  { label: "Tax / Legal Notices", value: "Tax / Legal Notices" },
  {
    label: "Event / Calendar Invitation",
    value: "Event / Calendar Invitation",
  },
  { label: "All", value: "all" },
];

const StepTwo: React.FC<StepProps> = ({
  register,
  errors,
  setValue,
  watch,
  getValues,
}) => {
  const [pdffiles, setPDFFiles] = useState<File | null>();
  const [selectTemplateId, setSelectTemplateId] = useState("");
  const queryClient = useQueryClient();
  const [generatedTemplate, setGeneratedTemplate] =
    useState<EmailTemplate | null>(null);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isAiGenerate, setIsAiGenerate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [editData, setEditData] = useState({
    subject: "",
    htmlBody: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [filterId, setFilterId] = useState<{
    label: string;
    value: string;
  } | null>(null);
  console.log("filterId");
  console.log(filterId);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleFilter = (e: any) => {
    setIsOpenFilter(false);
    if (e?.value === "all") {
      setFilterId(null);
    } else {
      setFilterId(e);
    }
  };

  const extractBodyContent = (html: string) => {
    const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return match ? match[1] : html; // fallback to full html if <body> is not found
  };

  const tableParams = {
    userId: localStorage.getItem("user"),
    search: searchQuery,
    category: (filterId?.value as string) || "",
  };
  const { data: TemplateData } = useTemplateList({
    ...tableParams,
  });

  const { mutate: UploadImage } = useUploadImageTemplate({
    onSuccess(data) {
      console.log(data);
      setValue("image", data?.data.url);
    },
  });
  // Helper function to render safe HTML preview
  const renderHtmlPreview = (html: string) => {
    // Extract body content and limit the content for preview
    const bodyContent = extractBodyContent(html);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = bodyContent;

    // Remove script tags and other potentially harmful elements
    const scripts = tempDiv.querySelectorAll("script");
    scripts.forEach((script) => script.remove());

    return tempDiv.innerHTML;
  };

  const { mutate: CreateTemplate } = useAddTemplate({
    onSuccess() {
      queryClient.refetchQueries();
      setIsNewOpen(false);
      setIsAiGenerate(false);
      // setIsDelete(false)
      setGeneratedTemplate(null);
      TemplateForm.reset();
      AITemplateForm.reset();
      toast.success("Template Added successfully");
    },
  });
  const TemplateForm = useForm({
    resolver: yupResolver(templateSchema),
  });

  const AITemplateForm = useForm({
    resolver: yupResolver(AIValidationSchema),
    mode: "onChange",
  });

  const {
    mutate: GenerateTemplate,
    isLoading,
    isSuccess,
  } = useGenerateTemplate({
    onSuccess(data: any) {
      console.log(data);
      setGeneratedTemplate(data.data);
    },
  });

  console.log(generatedTemplate);

  const selectedTemplates = watch("step2.selectedTemplate") || [];

  const maxSelections = 20; // Maximum allowed template selections

  register("step2.selectedTemplate");

  const handleSelectTemplate = (templateId: string): void => {
    const isSelected = selectedTemplates.includes(templateId);

    let updatedSelection;

    if (isSelected) {
      updatedSelection = selectedTemplates.filter(
        (id: any) => id !== templateId,
      );
    } else {
      if (selectedTemplates.length < maxSelections) {
        updatedSelection = [...selectedTemplates, templateId];
      } else {
        updatedSelection = selectedTemplates;
      }
    }
    setValue("step2.selectedTemplate", updatedSelection, {
      shouldValidate: true,
    });
  };
  const handleViewTemplate = (templateId: string): void => {
    // Implement your template preview logic here
    setSelectTemplateId(templateId);
    console.log(`Viewing template ${templateId}`);
  };

  const handleEditClick = () => {
    if (generatedTemplate) {
      setEditData({
        subject: generatedTemplate.subject,
        htmlBody: generatedTemplate.htmlBody,
      });
      setIsEditing(true);
    }
  };

  const handleSaveClick = () => {
    if (editorRef.current) {
      const updatedHtml = editorRef.current.innerHTML;
      const updateSubject = inputRef.current?.innerHTML;
      if (generatedTemplate) {
        setGeneratedTemplate({
          ...generatedTemplate,
          htmlBody: updatedHtml,
          subject: updateSubject as string,
        }); // You can also store this updatedHtml elsewhere
      }
      console.log("Updated HTML:", updatedHtml);
      setIsEditing(false);
    }
  };

  const stripHtml = (html: string): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Replace <br> and <p> with newlines
    tempDiv.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
    tempDiv.querySelectorAll("p").forEach((p) => {
      const newline = document.createTextNode("\n\n");
      p.parentNode?.insertBefore(newline, p.nextSibling);
    });

    // Replace <li> with newline and bullet
    tempDiv.querySelectorAll("li").forEach((li) => {
      li.textContent = `• ${li.textContent}`;
      const newline = document.createTextNode("\n");
      li.parentNode?.insertBefore(newline, li.nextSibling);
    });

    // Strip all tags and return plain text
    return tempDiv.textContent?.trim() || "";
  };

  const handleContentChange = (e: React.FocusEvent, originalNode: any) => {
    if (generatedTemplate) {
      const newHtml = generatedTemplate.htmlBody.replace(
        new RegExp(
          `<${originalNode.name}[^>]*>.*?</${originalNode.name}>`,
          "s",
        ),
        `<${originalNode.name}>${e.currentTarget.innerHTML}</${originalNode.name}>`,
      );
      setGeneratedTemplate({ ...generatedTemplate, htmlBody: newHtml });
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = editData.htmlBody;
    }
  }, []);

  const handleHtmlEdit = () => {
    if (editorRef.current) {
      setEditData({
        ...editData,
        htmlBody: editorRef.current.innerHTML,
      });
    }
  };

  const renderEditableContent = (html: string) => {
    const options = {
      replace: (domNode: any) => {
        if (domNode.type === "tag" && domNode.name === "p") {
          return (
            <p
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange(e, domNode)}
              className={
                isEditing ? "border-b border-dashed border-gray-300" : ""
              }
            >
              {parse(
                domNode.children.map((child: any) => child.data || "").join(""),
              )}
            </p>
          );
        }
        // Add similar handlers for other elements (li, div, etc.)
      },
    };

    return parse(html, options);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const SaveTemplate = (data: any) => {
    console.log(data);
    const templateData = {
      templateName: data.templateName,
      templateType: "manual",
      category: data.maualcategory.value,
      subject: data.subject,
      ctaButtonName:
        data.ctaType.value === "others" ? data.customText : data.ctaType.label,
      // senderName: data.senderName,
      // senderEmail: data.senderEmail,
      placeholders: data.placeholders.split(","),
      content: data.content,
      // content: values,
      image: getValues("image"), // This should be a File/Blob object
      isActive: true,
      userId: localStorage.getItem("user") as string,
    };

    CreateTemplate(templateData);
  };

  const isFormValid =
    AITemplateForm.watch("aitemplateName") &&
    AITemplateForm.watch("prompt") &&
    AITemplateForm.watch("ctaButtonName") &&
    AITemplateForm.watch("category") &&
    AITemplateForm.watch("industry") &&
    AITemplateForm.watch("tone");

  const AIGenerate = (data: any) => {
    // AITemplateForm.reset()
    const obj = {
      userId: localStorage.getItem("user") as string,
      templateName: data.aitemplateName,
      ctaButtonName: data.ctaButtonName,
      prompt: data.prompt,
      category: data.category.label,
      tone: data.tone.label,
      industry: data.industry.label,
    };
    console.log(obj);
    GenerateTemplate(obj);
  };

  const content = TemplateForm.watch("content");

  const SaveAiTemplate = () => {
    const templateData = {
      templateName: generatedTemplate?.templateName as string,
      templateType: "AI-generated",
      subject: generatedTemplate?.subject as string,
      placeholders: generatedTemplate?.placeholders as string[],
      content: generatedTemplate?.htmlBody as string,
      isActive: true,
      userId: localStorage.getItem("user") as string,
    };

    CreateTemplate(templateData);
  };

  const selectedCtaType = TemplateForm.watch("ctaType");
  console.log("selisFormValid");
  console.log(selectedCtaType);
  const showCustomInput = selectedCtaType?.value === "others";

  const uploadPDF = (fileData: any) => {
    console.log("file", fileData);
    setPDFFiles(fileData);
    const formData: any = new FormData();
    formData.append("image", fileData);
    UploadImage(formData);
  };

  console.log("isFormValid");
  console.log(showCustomInput);
  console.log("isFormValid");
  console.log(isFormValid);
  console.log(selectedTemplates);
  console.log(TemplateData?.templates);
  const isAdmin = localStorage.getItem("isAdmin");

  function makeButtonEditable(html) {
    return html.replace(
      /<a([^>]*)>(.*?)<\/a>/gi,
      `<a$1><span contenteditable="true">$2</span></a>`,
    );
  }

  return (
    <div className="step-content">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-1">
          Step 2: Select Email Templates
        </h2>
        <div className="flex gap-2">
          <Button
            type="button"
            className="bg-purple-950 text-white hover:bg-purple-700 font-bold"
            onClick={() => setIsAiGenerate(true)}
          >
            AI Generate
          </Button>
            <Button
              type="button"
              onClick={() => setIsNewOpen(true)}
              className="bg-purple-950 text-white hover:bg-purple-700 font-bold"
            >
              Create Template
            </Button>
        </div>
      </div>

      <Dialog
        open={isNewOpen}
        onOpenChange={() => {
          setIsNewOpen(false);
          TemplateForm.reset();
        }}
      >
        <DialogContent className="mb-[10]  lg:max-w-[500px] p-0">
          <DialogHeader className="border-lightGray bg-cultured h-[3.875rem] rounded-t-lg border-b text-left justify-center ">
            <DialogTitle className=" lg:p-[1.56rem] text-lg font-semibold leading-5 px-2">
              Create New Template
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[40rem] w-[500px] rounded-md border ">
            <div className="p-4">
              {/* Header */}
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                {/* <h2 className="text-lg font-semibold leading-none tracking-tight">
          Create New Template
        </h2> */}
                <p className="text-sm text-muted-foreground">
                  Fill in the details to create a new phishing template.
                </p>
              </div>

              {/* Form Fields */}
              <form
                className="grid gap-4 py-4"
                onSubmit={TemplateForm.handleSubmit(SaveTemplate)}
              >
                {/* Template Name */}
                <div className="grid gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Template Name
                  </label>
                  <input
                    id="name"
                    {...TemplateForm.register("templateName")}
                    type="text"
                    placeholder="Enter template name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  {TemplateForm.formState.errors.templateName &&
                    TemplateForm.formState.errors.templateName && (
                      <div className="text-destructive mt-2">
                        {TemplateForm.formState.errors.templateName.message}
                      </div>
                    )}
                </div>

                {/* Category Dropdown */}
                <div className="grid gap-2 mb-4">
                  <div className="flex gap-1 items-center w-full">
                    <Label
                      htmlFor="templatecategory"
                      className=" block font-bold text-default-600"
                    >
                      Select Category
                    </Label>
                    {/* <img
                        src={Symbol}
                        alt="image"
                        className=" w-[14px] h-[14px] mb-2 "
                      /> */}
                  </div>
                  <SelectComponent
                    {...TemplateForm.register("maualcategory")}
                    styles={SelectStyles}
                    options={phishingCategories}
                    placeholder="Select category"
                    clName="text-[#696767] block mb-4 mx-auto sm:mx-0 focus:border-primary lg:h-[2.25rem] w-full sm:mb-0"
                    // value={addressCountry}
                    onChange={(selectedOption) => {
                      TemplateForm.setValue("maualcategory", selectedOption); // Update the form value
                    }}
                  />
                  {TemplateForm.formState.errors.maualcategory && (
                    <div className="text-destructive mt-2">
                      {TemplateForm.formState.errors.maualcategory.label
                        ?.message ||
                        TemplateForm.formState.errors.maualcategory.value
                          ?.message}
                    </div>
                  )}
                </div>

                {/* Email Subject */}
                <div className="grid gap-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    {...TemplateForm.register("subject")}
                    placeholder="Enter email subject"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  {TemplateForm.formState.errors.subject &&
                    TemplateForm.formState.errors.subject && (
                      <div className="text-destructive mt-2">
                        {TemplateForm.formState.errors.subject.message}
                      </div>
                    )}
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Image
                  </label>
                  <div className="flex-1">
                    <input
                      id="customFileUpload2"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        uploadPDF(e.target.files?.[0] || null);
                        // field.onChange(e.target.files?.[0] || null)
                      }}
                    />
                    <label
                      htmlFor="customFileUpload2"
                      className="block w-full p-2 border border-gray-300 rounded-lg cursor-pointer truncate"
                    >
                      {pdffiles ? pdffiles.name : "1. Choose Image..."}
                    </label>
                  </div>
                </div>

                <div className="grid gap-2 mb-4">
                  <div className="flex gap-1 items-center w-full">
                    <Label
                      htmlFor="cta"
                      className=" block font-bold text-default-600"
                    >
                      Select CTA
                    </Label>
                    {/* <img
                        src={Symbol}
                        alt="image"
                        className=" w-[14px] h-[14px] mb-2 "
                      /> */}
                  </div>
                  <SelectComponent
                    {...TemplateForm.register("ctaType")}
                    styles={SelectStyles}
                    options={options}
                    placeholder="Select cta type"
                    clName="text-[#696767] block mb-4 mx-auto sm:mx-0 focus:border-primary lg:h-[2.25rem] w-full sm:mb-0"
                    // value={addressCountry}
                    onChange={(selectedOption) => {
                      TemplateForm.setValue("ctaType", selectedOption); // Update the form value
                      TemplateForm.trigger("ctaType");
                    }}
                  />
                  {TemplateForm.formState.errors.ctaType && (
                    <div className="text-destructive mt-2">
                      {TemplateForm.formState.errors.ctaType.label?.message ||
                        TemplateForm.formState.errors.ctaType.value?.message}
                    </div>
                  )}
                </div>
                {showCustomInput && (
                  <div className="grid gap-2">
                    <label
                      htmlFor="customText"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Custom Text *
                    </label>
                    <input
                      {...TemplateForm.register("customText")}
                      type="text"
                      name="customText"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter custom CTA (max 10 chars)"
                    />

                    <div className="flex justify-between mt-1">
                      <div>
                        {TemplateForm.formState.errors.customText &&
                          TemplateForm.formState.errors.customText && (
                            <div className="text-destructive ">
                              {
                                TemplateForm.formState.errors.customText
                                  ?.message
                              }
                            </div>
                          )}
                      </div>

                      <span className="text-xs text-gray-500">
                        {TemplateForm.watch("customText")?.length || 0}/10
                      </span>
                    </div>
                  </div>
                )}

                {/* Email Content */}
                <div className=" max-w-[460px]">
                  <label
                    htmlFor="content"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email Content
                  </label>
                  <textarea
                    id="content"
                    placeholder="Enter email content"
                    {...TemplateForm.register("content")}
                    rows={8}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {/* <ReactQuill
                          theme='snow'
                          placeholder='Enter Article'
                          className='overflow-y h-[15rem] rounded-xl  bg-[#F6F6F6] pb-[3rem]'
                          // {...TemplateForm.register("content")}
                          value={values} onChange={setValue}
                          modules={modules}
                        /> */}
                  {/* <CharacterCountQuill
                        readOnly={false}
                        // maxLength={800000000}
                        placeholder='Enter Description'
                        // maxChara='Max 800000000 Characters'
                        // field={TemplateForm.register("content")}
                        // ErrorMessage={FormMessage}
                        onChange={(value: string) => {
                          console.log(value)
                          TemplateForm.setValue('content', value, { shouldValidate: true });
                        }}
                        value={content}
                      /> */}
                  {TemplateForm.formState.errors.content &&
                    TemplateForm.formState.errors.content && (
                      <div className="text-destructive mt-2">
                        {TemplateForm.formState.errors.content.message}
                      </div>
                    )}
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Placeholder
                  </label>
                  <input
                    id="name"
                    {...TemplateForm.register("placeholders")}
                    type="text"
                    placeholder="Enter template name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  {TemplateForm.formState.errors.placeholders &&
                    TemplateForm.formState.errors.placeholders && (
                      <div className="text-destructive mt-2">
                        {TemplateForm.formState.errors.placeholders.message}
                      </div>
                    )}
                </div>

                <div className="max-w-[460px] flex flex-col-reverse sm:flex-row justify-center sm:space-x-2 bg-purple-950 text-white hover:bg-purple-700 font-bold  rounded-md  mt-4 py-2">
                  <button type="submit">Save Template</button>
                </div>
              </form>

              {/* Save Button */}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* AI Generate */}

      <Dialog open={isAiGenerate} onOpenChange={setIsAiGenerate}>
        <DialogContent className="mb-[10]  max-h-[48.6875rem]  lg:max-w-[1000px] p-0">
          <DialogHeader className="border-lightGray bg-cultured h-[3.875rem] rounded-t-lg border-b text-left justify-center ">
            <DialogTitle className=" lg:p-[1.56rem] text-lg font-semibold leading-5 px-2">
              AI Template
            </DialogTitle>
          </DialogHeader>

          <div className=" p-6 bg-white rounded-lg shadow-md ">
            {/* <h1 className="text-2xl font-bold text-gray-800 mb-6">Phish_Sim_1</h1> */}
            <p className="text-sm text-muted-foreground">
              Fill in the details to create a new AI phishing template.
            </p>
            <div className="  w-full flex gap-4 space-y-6">
              {/* To Section */}
              <div className="w-[400px]">
                <form onSubmit={AITemplateForm.handleSubmit(AIGenerate)}>
                  <div className=" mb-4 mt-4">
                    <label
                      htmlFor="aitemplateName"
                      className="text-sm font-bold text-default-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
                    >
                      Template Name
                    </label>
                    <input
                      id="templateName"
                      {...AITemplateForm.register("aitemplateName")}
                      name="aitemplateName"
                      type="text"
                      placeholder="Enter template name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 mt-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />

                    <div className="mb-4 mt-4">
                      <label
                        htmlFor="prompt"
                        className="text-sm font-bold text-default-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enter the prompt to create your email{" "}
                        <span className="inline-flex items-center gap-1 relative group">
                          template
                          <FaEye className="text-gray-500 cursor-pointer" />
                          {/* Hover message */}
                          <span className="absolute left-1/2 -translate-x-1/2 top-6 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                            Please don’t change any variables given in the
                            template
                          </span>
                        </span>
                      </label>

                      <textarea
                        id="prompt"
                        {...AITemplateForm.register("prompt")}
                        name="prompt"
                        placeholder="Enter the prompt"
                        maxLength={50}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 mt-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                      ></textarea>
                    </div>

                    {/* {TemplateForm.formState.errors.templateName && (
            TemplateForm.formState.errors.templateName && <div className="text-destructive mt-2">{TemplateForm.formState.errors.templateName.message}</div>
          )} */}
                  </div>
                  <div className=" mb-4 mt-4">
                    <label
                      htmlFor="ctaButtonName"
                      className="text-sm font-bold text-default-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
                    >
                      CTA Button Name
                    </label>
                    <input
                      id="ctaButtonName"
                      {...AITemplateForm.register("ctaButtonName")}
                      name="ctaButtonName"
                      type="text"
                      placeholder="Enter CTA button name"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 mt-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <div className="flex gap-1 items-center w-full">
                      <Label
                        htmlFor="category"
                        className=" block mb-2 font-bold text-default-600"
                      >
                        Select Category
                      </Label>
                      {/* <img
                        src={Symbol}
                        alt="image"
                        className=" w-[14px] h-[14px] mb-2 "
                      /> */}
                    </div>
                    <SelectComponent
                      {...AITemplateForm.register("category")}
                      styles={SelectStyles}
                      options={Category}
                      name="category"
                      placeholder="Select category"
                      clName="text-[#696767] block mb-4 mx-auto sm:mx-0 focus:border-primary lg:h-[2.25rem] w-full sm:mb-0"
                      // value={addressCountry}
                      onChange={(selectedOption) => {
                        AITemplateForm.setValue("category", selectedOption); // Update the form value
                      }}
                    />
                    {/* {errors.country && !getValues("country")?.label && (
              <div className="text-destructive mt-2">
                {errors.country.label?.message || errors.country.value?.message}
              </div>
            )} */}
                  </div>

                  <div className="  mb-4">
                    <div className="flex gap-1 items-center w-full ">
                      <Label
                        htmlFor="industry"
                        className=" block mb-2 font-bold text-default-600"
                      >
                        Select Industry
                      </Label>
                      {/* <img
                        src={Symbol}
                        alt="image"
                        className=" w-[14px] h-[14px] mb-2 "
                      /> */}
                    </div>
                    <SelectComponent
                      {...AITemplateForm.register("industry")}
                      // defaultValue={{label:"Account", value:"Account"}}
                      styles={SelectStyles}
                      options={Industy}
                      name="industry"
                      placeholder="Select industry"
                      clName="text-[#696767] mb-4 mx-auto sm:mx-0 focus:border-primary lg:h-[2.25rem] w-full sm:mb-0"
                      // value={Industry}
                      onChange={(selectedOption) => {
                        // console.log(selectedOption)
                        AITemplateForm.setValue("industry", selectedOption); // Update the form value
                        // console.log(AITemplateForm.getValues("industry"))
                        // AITemplateForm.watch("industry")
                        // AITemplateForm.trigger("industry")
                      }}
                    />
                    {/* {errors.country && !getValues("country")?.label && (
              <div className="text-destructive mt-2">
                {errors.country.label?.message || errors.country.value?.message}
              </div>
            )} */}
                  </div>

                  <div className="mb-4">
                    <div className="flex gap-1 items-center w-full">
                      <Label
                        htmlFor="role"
                        className=" block mb-2 font-bold text-default-600"
                      >
                        Select tone
                      </Label>
                      {/* <img
                        src={Symbol}
                        alt="image"
                        className=" w-[14px] h-[14px] mb-2 "
                      /> */}
                    </div>
                    <SelectComponent
                      {...AITemplateForm.register("tone")}
                      styles={SelectStyles}
                      options={Tone}
                      name="tone"
                      placeholder="Select tone"
                      clName="text-[#696767] block mb-4 mx-auto sm:mx-0 focus:border-primary lg:h-[2.25rem] w-full sm:mb-0"
                      // value={addressCountry}
                      onChange={(selectedOption) => {
                        AITemplateForm.setValue("tone", selectedOption); // Update the form value
                      }}
                    />
                    {/* {errors.country && !getValues("country")?.label && (
              <div className="text-destructive mt-2">
                {errors.country.label?.message || errors.country.value?.message}
              </div>
            )} */}
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2">
                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className={`
    inline-flex items-center justify-center gap-2
    whitespace-nowrap rounded-md text-sm font-medium
    transition-colors focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-ring
    focus-visible:ring-offset-2 h-10 px-4 py-2
    ${
      isFormValid
        ? "bg-purple-950 text-white hover:bg-purple-700 cursor-pointer"
        : "bg-gray-400 text-gray-200 cursor-not-allowed"
    }
  `}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                        <path d="M20 3v4" />
                        <path d="M22 5h-4" />
                        <path d="M4 17v2" />
                        <path d="M5 18H3" />
                      </svg>
                      Generate Template
                    </button>
                  </div>
                </form>
              </div>
              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Subject Line */}
              {/* <div className='border-4 gradient-border rounded-lg h-[400px] w-full p-4'>
          {isLoading && (
            <div className=''>
              <h1>Loading....</h1>
              </div>
              
          )}

          {isSuccess && generatedTemplate && (
              <div>
              <div className="flex gap-2 mb-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Subject:</h3>
          <p className="text-gray-800">{generatedTemplate?.subject}</p>
        </div>
  
        
        <div className="flex gap-2 mb-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-1">Sender Name:</h3>
     
        </div>
  
       
        <div className="mb-6">
          <p className="text-gray-800 mb-4">
            Dear [Recipient name],
          </p>
          
          <div className='h-[200px] overflow-y-scroll' dangerouslySetInnerHTML={{ __html: generatedTemplate?.htmlBody as any}} />
          
        </div>
  
      </div>
          )}
        </div> */}
              <div className="relative border-4 gradient-border rounded-lg h-[400px] w-full p-4">
                {isLoading && (
                  <div className="">
                    <h1>Loading....</h1>
                  </div>
                )}

                {isSuccess && generatedTemplate && (
                  <>
                    {/* Edit/Save buttons at top right */}
                    <div className="absolute bottom-0 right-8 flex gap-2">
                      {!isEditing ? (
                        <button
                          onClick={handleEditClick}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full"
                          title="Edit template"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={handleSaveClick}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full"
                            title="Save changes"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                            title="Cancel editing"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Content area */}
                    <div className="">
                      {!isEditing ? (
                        // View mode
                        <div>
                          <div className="flex gap-2 mb-4">
                            <h3 className="text-sm font-semibold text-gray-500 mb-1">
                              Subject:
                            </h3>
                            <p className="text-gray-800">
                              {generatedTemplate?.subject}
                            </p>
                          </div>

                          <div className="flex gap-2 mb-4">
                            <h3 className="text-sm font-semibold text-gray-500 mb-1">
                              Sender Name:
                            </h3>
                          </div>
                          {/* <h2 className="text-xl font-bold mb-2">{generatedTemplate.templateName}</h2> */}
                          {/* <h3 className="text-lg font-semibold mb-4">{generatedTemplate.subject}</h3> */}
                          {/* <div 
                  // className="prose max-w-none" 
                  className='h-[250px]  overflow-y-scroll'
                  dangerouslySetInnerHTML={{ __html: generatedTemplate.htmlBody }} 
                /> */}
                          {/* <div>{generatedTemplate.htmlBody}</div> */}
                          {/* <div className='h-[200px] w-[500px] overflow-y-scroll'>
                {parse(generatedTemplate.htmlBody )}
                </div> */}

                          {/* <MyComponent html={generatedTemplate.htmlBody}/> */}
                          <div className="h-[250px] overflow-y-scroll">
                            {renderEditableContent(
                              extractBodyContent(generatedTemplate.htmlBody),
                            )}
                          </div>
                        </div>
                      ) : (
                        // Edit mode
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-sm font-semibold text-gray-500 mb-1">
                              Subject:
                            </h3>
                            <div
                              ref={inputRef}
                              contentEditable
                              // value={stripHtml(editData.subject)}
                              dangerouslySetInnerHTML={{
                                __html: generatedTemplate.subject,
                              }}
                              // onChange={(e) => setEditData({...editData, subject: e.target.value,htmlBody: ''})}
                              className="w-full px-3 py-2  focus:outline-none "
                            />

                            {/* <div
        ref={editorRef}
        contentEditable
        dangerouslySetInnerHTML={{ __html: generatedTemplate.subject  }}
        className="w-full px-3 py-2"
      /> */}
                          </div>
                          {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={editData.subject}
                    onChange={(e) => setEditData({...editData, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div> */}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Content
                            </label>
                            {/* <textarea
                    value={editData.htmlBody}
                    onChange={(e) => setEditData({...editData, htmlBody: e.target.value})}
                    className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  /> */}
                            <div
                              ref={editorRef}
                              contentEditable
                              dangerouslySetInnerHTML={{
                                __html: generatedTemplate.htmlBody,
                              }}
                              // onInput={handleHtmlEdit}
                              className="h-[250px]  overflow-y-scroll"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                className="bg-white border-2 border-[rgb(101,79,232)] text-[rgb(101,79,232)] hover:bg-white"
                onClick={() => {
                  setIsAiGenerate(false);
                  AITemplateForm.reset({});
                  setGeneratedTemplate(null);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={!isFormValid}
                onClick={SaveAiTemplate}
                className={`
    inline-flex items-center justify-center gap-2
    whitespace-nowrap rounded-md text-sm font-medium
    transition-colors focus-visible:outline-none
    focus-visible:ring-2 focus-visible:ring-ring
    focus-visible:ring-offset-2 h-10 px-4 py-2
    ${
      isFormValid
        ? "bg-purple-950 text-white hover:bg-purple-700 cursor-pointer"
        : "bg-gray-400 text-gray-200 cursor-not-allowed"
    }
  `}
              >
                Save Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Select Template  */}

      {selectTemplateId && (
        <SelectedTemplate id={selectTemplateId} setId={setSelectTemplateId} />
      )}

      {/* Selection Counter */}
      {/* <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-blue-800">
          Selected: {selectedTemplates.length} of {maxSelections} templates
          {selectedTemplates.length >= maxSelections && (
            <span className="ml-2 text-red-500">(Maximum reached)</span>
          )}
        </p>

        <p className="text-sm text-gray-600 mt-1">
          To make campaigns unique and unpredictable, you may select up to{" "}
          {maxSelections} phishing emails. Each employee will randomly receive
          one email.
        </p>
      </div> */}

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="flex justify-between ">
          <div className="w-full lg:w-1/3 md:w-1/2">
            <div className="flex mb-2 h-9">
              <div
                className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l"
                title="Search for a specific employee list by typing the name of it into the search box."
              >
                <b>Search:</b>
              </div>
              <input
                type="text"
                className="form-input flex-grow border rounded-r px-3 py-2 placeholder:text-[1rem] placeholder:text-[#696767]"
                id="employeeSearch"
                placeholder="Search for a specific template"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="w-full lg:w-1/3 md:w-1/2">
            <div className="flex mb-2 h-9">
              <div
                className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l"
                title="Search for a specific employee list by typing the name of it into the search box."
              >
                <b>Filter:</b>
              </div>
              <SelectComponent
                styles={SelectStyles}
                options={phishingCategories}
                placeholder="Select category"
                clName="text-[#696767] block mb-4 mx-auto sm:mx-0 lg:h-[2.25rem] w-full sm:mb-0"
                onChange={(selectedOption) => {
                  handleRoleFilter(selectedOption);
                }}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-2 overflow-y-scroll">
          {TemplateData?.templates.map((template: any) => (
            <div key={template._id} className="w-full  mb-2">
              <div
                className={`bg-white p-[10px] box-border border rounded-lg transition-all 
              ${
                selectedTemplates.includes(template._id)
                  ? "ring-2 ring-blue-500 border-blue-300"
                  : "border-gray-200"
              }`}
              >
                <div className="pt-2 pb-2 border-b border-gray-300 bg-gray-50 rounded-t-lg">
                  <span className="pl-2.5 font-mono">
                    {template.templateName}
                  </span>
                  <span className="float-right pr-2.5 font-mono">
                    {template.category?.charAt(0).toUpperCase() +
                      template.category?.slice(1) || "AI-Generated"}
                  </span>
                </div>
                <div className="w-full relative">
                  <div className="p-4">
                    {/* Content Preview */}
                    <div className="mb-3">
                      <div className="text-xs font-semibold text-gray-500 mb-2">
                        Preview:
                      </div>
                      <div className="border border-gray-200 rounded bg-gray-50 p-3 h-32 overflow-hidden relative">
                        {template.content ? (
                          <div className="text-sm text-gray-700 leading-relaxed">
                            {/* Render HTML content safely or show text preview */}
                            <div
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: renderHtmlPreview(template.content),
                              }}
                              style={{
                                fontSize: "12px",
                                lineHeight: "1.4",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            />
                            {/* Fade overlay for overflow */}
                            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 to-transparent"></div>
                          </div>
                        ) : (
                          <div className="text-gray-500 italic text-sm">
                            No content preview available
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Template Stats */}
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                      <span>Type: {template.templateType || "Manual"}</span>
                    </div>
                  </div>

                  {/* Overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black bg-opacity-30 hover:bg-opacity-20 transition-all duration-300"
                    onClick={() => handleViewTemplate(template._id)}
                  >
                    {/* Center Icon */}
                    <div className="hover:block hidden text-center">
                      <i className="mdi mdi-email-edit text-5xl text-white opacity-80"></i>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="pt-2 pb-2 text-center border-t border-gray-300 font-mono bg-gray-50 cursor-pointer text-blue-600 rounded-b-lg hover:bg-gray-100"
                  onClick={() => handleSelectTemplate(template._id)}
                >
                  {selectedTemplates.includes(template._id)
                    ? "Selected ✓"
                    : "Select this template"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {errors.step2?.selectedTemplate && (
        <>
          <p className="text-red-500 text-sm mt-2">
            {errors.step2.selectedTemplate.message}
          </p>
          {/* {toast.error(`${errors.step1.selectedEmployees.message}`)} */}
        </>
      )}
    </div>
  );
};

export default StepTwo;
