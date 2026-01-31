// import { Icon } from "@iconify/react";
// import background from "@/assets/images/auth/line.png";
import { Outlet } from 'react-router-dom';
import bgImage from "@/assets/phishing1.jpg";

const AuthLayout = () => {
    return (
        <>
            <div className="min-h-screen  flex items-center  overflow-hidden w-full bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
                <div className="min-h-screen basis-full flex flex-wrap w-full  justify-center overflow-y-auto">

                    <div className=" min-h-screen basis-full md:basis-1/2 w-full px-4 py-5 flex justify-center items-center">
                        <div className="max-w-[550px] w-full ">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthLayout;
