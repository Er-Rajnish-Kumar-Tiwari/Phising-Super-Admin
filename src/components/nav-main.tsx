import { ChevronRight, HomeIcon, CirclePlay } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  title: string;
  url: string;
  icon?: React.ElementType;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

interface NavMainProps {
  items: {
    nav: NavItem[];
    navMain: NavItem[];
  };
}

export function NavMain({ items }: NavMainProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

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

  return (
    <SidebarGroup className="">
      <SidebarGroupLabel>Platform & Tools</SidebarGroupLabel>
      <SidebarMenu>
        {/* Regular navigation items */}
        {items.nav.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              className={`hover:bg-[#27A9E3] hover:text-white active:bg-primary-900 active:text-primary-foreground text-[#9A9C9F] ${
                pathname === item.url ? "bg-[#27A9E3] text-white" : ""
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
        {items.navMain.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger
                asChild
                className="hover:bg-[#27A9E3] hover:text-white active:bg-primary-900 active:text-primary-foreground group-data-[state=open]/collapsible:bg-[#27A9E3] group-data-[state=open]/collapsible:text-white text-[#9A9C9F]"
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
                        className={`hover:bg-[#27A9E3] hover:text-white active:bg-primary-900 active:text-primary-foreground text-[#9A9C9F] ${
                          pathname === subItem.url
                            ? "bg-[#27A9E3] text-white"
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
  );
}
