import React, { useState } from "react";
import Victory from "./../../assets/victory.svg";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Background from "./../../assets/login2.png";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/api";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const {setUserInfo}=useAppStore();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is Required");
      return false;
    }
    if (!password.length) {
      toast.error("password is Required");
      return false;
    }
    return true;
  };
  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is Required");
      return false;
    }
    if (!password.length) {
      toast.error("password is Required");
      return false;
    }
    if (password != confirmPassword) {
      toast.error("password and Confirm password should be same");
      return false;
    }
    return true;
  };
  const handleLogin = async () => {
    if (validateLogin()) {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true },
      );
      if(response.data._id){
        setUserInfo(response.data);
        if(response.data.profileSetup)navigate('/chat');
        else navigate('/profile')
      }
      console.log(response);
    }
  };
  const handleSignUp = async () => {
    if (validateSignup()) {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true },
      );
              setUserInfo(response.data);

      console.log(response);
      if (response.status === 201) {
        navigate("/profile");
      }
    }
  };
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="min-h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-4xl font-bold md:text-5xl ">Welcome</h1>
              {/* <img src={Victory} alt="Victory Image" className="h-[100px]" /> */}
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex  items-center justify-center w-full">
            <Tabs className="w-3/4 grid" defaultValue="login">
              <TabsList className="grid grid-cols-2 bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-tranparent text-black text-opacity-50 border-b-2 rounded-noe w-full data-[state=active]:text-black data-[state=active]:semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-tranparent text-black text-opacity-50 border-b-2 rounded-noe w-full data-[state=active]:text-black data-[state=active]:semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 "
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Input>
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Input>
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>

              <TabsContent className="flex flex-col gap-5 mt-10" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Input>
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Input>
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Input>
                <Button className="rounded-full p-6" onClick={handleSignUp}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="background-img" className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
