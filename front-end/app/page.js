"use client";
import Input from "@/components/Input";
import { postRequest } from "@/ultis/helper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import { setCookie } from "cookies-next";

export default function Home() {
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState({});
  const router = useRouter();
  const { setAuthUser } = useAuth();

  const onFormSubmit = async (event) => {
    event.preventDefault();

    await postRequest({
      url: "http://localhost:9000/api/v1/login",
      body: formData,
      handleError: function (error) {
        setFormError(error);
      },
      handleSuccess: function (data) {
        setAuthUser(data);
        setCookie("auth_token", data?.token);
        setCookie("name", data?.name);

        router.push("/dashboard");
      },
    });
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <div className="min-h-screen flex items-center justify-center w-full ">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-900">
          Welcome Back!
        </h1>
        <form onSubmit={onFormSubmit}>
          <Input
            type="email"
            title="Email Address"
            name="email"
            placeholder="Your@email.com"
            onChange={handleInputChange}
            errors={formError}
          />
          <Input
            type="password"
            title="Password"
            name="password"
            placeholder="Enter your password"
            onChange={handleInputChange}
            errors={formError}
          />
          <p className="text-gray-900 text-sm pt-2">
            Don't have an account?
            <Link href="/register">
              <span className="pl-2 text-blue-700">Register</span>
            </Link>
          </p>
          <button
            type="submit"
            className="w-full flex mt-4 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
