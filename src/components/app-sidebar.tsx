import * as React from "react";
import { ChevronRight, HomeIcon, LogOut, Users } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo_one from "@/assets/images/dashboard/logo_one.png";
import { SupportTicketModal } from "./SupportTicketModal";
import logo from "@/assets/logo.png";
import sidebarImage from "@/assets/sidebarImage.jpg";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import toast from "react-hot-toast";

// Define TypeScript interfaces
interface NavItem {
  title: string;
  url: string;
  icon?: React.ElementType;
  isActive?: boolean;
  items?: { title: string; url: string; onClick?: () => void }[];
  onClick?: () => void;
}

interface SidebarData {
  nav: NavItem[];
  navMain: NavItem[];
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}

const handleEmailCopy = async () => {
  try {
    await navigator.clipboard.writeText("support@kevlardefense.com");
    toast.success("Email ID Copied email: support@kevlardefense.com");
  } catch (error) {
    toast.error("Failed to copy email  use email: support@kevlardefense.com");
  }
};

// Function to load Tawk.to chat script
const loadTawkToScript = () => {
  try {
    // Check if script is already loaded
    if (window.Tawk_API) {
      console.log("Tawk.to already loaded, maximizing chat");
      window.Tawk_API.maximize();
      return;
    }

    console.log("Loading Tawk.to script...");

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://embed.tawk.to/68a1b34b8e9f9519253da226/1j2rq8oek";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    // Initialize Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Add event listeners for debugging
    script.onload = () => {
      console.log("Tawk.to script loaded successfully");
    };

    script.onerror = (error) => {
      console.error("Failed to load Tawk.to script:", error);
    };

    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  } catch (error) {
    console.error("Error loading Tawk.to script:", error);
  }
};

// Function to handle email support
const handleEmailSupport = () => {
  const emailUrl =
    "mailto:support@phish.com?subject=Support Request&body=Hello, I need help with...";
  try {
    window.location.href = emailUrl;
  } catch (error) {
    console.error("Error opening email client:", error);
    // Fallback: copy email to clipboard
    navigator.clipboard
      ?.writeText("support@phish.com")
      .then(() => {
        alert("Email address copied to clipboard: support@phish.com");
      })
      .catch(() => {
        alert("Please email us at: support@phish.com");
      });
  }
};

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AppSidebar: React.FC<AppSidebarProps> = ({ ...props }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isTicketModalOpen, setIsTicketModalOpen] = React.useState(false);

  const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
    // Check for token existence without using localStorage directly in render
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  });

  React.useEffect(() => {
    // This effect runs whenever isLoggedIn changes
    if (!isLoggedIn) {
      window.location.reload(); // or use your router to redirect
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      setIsLoggedIn(false); // This triggers the useEffect
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleChatSupport = () => {
    console.log("Chat support clicked");
    loadTawkToScript();
  };

  const handleRaiseTicket = () => {
    setIsTicketModalOpen(true);
  };

  const handleTicketSubmit = (ticketData: any) => {
    // Handle ticket submission here - you can integrate with your API
    console.log("Ticket submitted:", ticketData);
    // Example: send to your backend API
    // submitTicketToAPI(ticketData);
    alert("Support ticket submitted successfully!");
  };

  // Helper function to handle navigation
  const handleNavigation = (url: string) => {
    if (
      url.startsWith("mailto:") ||
      url.startsWith("tel:") ||
      url.startsWith("http")
    ) {
      // For external links, mailto, tel, etc.
      window.location.href = url;
    } else if (url && url !== "#") {
      // For internal navigation
      navigate(url);
    }
  };

  const data: SidebarData = {
    nav: [
      { title: "Dashboard", url: "/", icon: Users },
      { title: "Campaigns", url: "/campaign", icon: Users },
      { title: "Employees", url: "/employee", icon: Users },
      { title: "Reporting", url: "/reporting", icon: Users },
      { title: "Settings", url: "/setting", icon: Users },
    ],
    navMain: [
      {
        title: "Get Help",
        url: "",
        icon: Users,
        isActive: false,
        items: [
          {
            title: "Raise a Ticket",
            url: "#",
            onClick: handleRaiseTicket,
          },
          {
            title: "Email Us",
            url: "#",
            onClick: handleEmailCopy,
          },

          {
            title: "Chat Support",
            url: "#", // Use # since we're handling click
            onClick: handleChatSupport,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
<SidebarHeader className="bg-purple-950">
  <SidebarMenuButton
    size="lg"
    className="
      bg-transparent
      hover:bg-transparent
      active:bg-transparent
      focus:bg-transparent
      data-[state=open]:bg-transparent
    "
  >
    <div
      className="flex aspect-square w-full h-10 items-center rounded-lg cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img
        src={logo}
        alt="logo"
        className="w-[140px] h-[50px]"
      />
    </div>
  </SidebarMenuButton>
</SidebarHeader>


      <SidebarContent
        style={{
          backgroundImage: `url(${sidebarImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <SidebarGroup>
          <SidebarMenu>
            {/* Regular navigation items */}
            {data.nav.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={` text-[18px] mb-3 hover:bg-purple-700 hover:text-white active:bg-primary-900 active:text-primary-foreground text-[#9A9C9F] ${
                    pathname === item.url ? "bg-purple-700 text-white" : ""
                  }`}
                  onClick={() => {
                    console.log(item);
                    handleNavigation(item.url);
                  }}
                >
                  {item.icon ? <item.icon /> : <HomeIcon />}
                  <div>
                    <span>{item.title}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            {/* Navigation items with submenus */}
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    asChild
                    className="text-[18px] hover:bg-purple-700 hover:text-white active:bg-primary-900 active:text-primary-foreground group-data-[state=open]/collapsible:bg-purple-700 group-data-[state=open]/collapsible:text-white text-[#9A9C9F]"
                  >
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="border-l border-primary-900">
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={`hover:bg-purple-700 hover:text-white active:bg-primary-900 active:text-primary-foreground text-[#9A9C9F] ${
                              pathname === subItem.url
                                ? "bg-purple-700 text-white"
                                : ""
                            }`}
                          >
                            {subItem.url.startsWith("mailto:") ? (
                              <a
                                href={subItem.url}
                                className="cursor-pointer"
                                onClick={(e) => {
                                  console.log("Opening email client...");
                                }}
                              >
                                <span>{subItem.title}</span>
                              </a>
                            ) : (
                              <div
                                onClick={() => {
                                  if (subItem.onClick) {
                                    subItem.onClick();
                                  } else {
                                    handleNavigation(subItem.url);
                                  }
                                }}
                                className="cursor-pointer"
                              >
                                <span>{subItem.title}</span>
                              </div>
                            )}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter className="bg-purple-950 hover:bg-purple-700 text-white text-center items-center justify-center pr-4">
        <div
          onClick={handleLogout}
          className="flex gap-4 items-center cursor-pointer text-center"
        >
          <LogOut />
          <div>
            <span>Logout</span>
          </div>
        </div>
      </SidebarFooter>

      {/* Support Ticket Modal */}
      <SupportTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSubmit={handleTicketSubmit}
        groupId="1" // You can make this dynamic based on your application logic
      />
    </Sidebar>
  );
};
