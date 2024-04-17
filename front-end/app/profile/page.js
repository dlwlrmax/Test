"use client";
import Wrapper from "@/components/Wrapper";
import Input from "@/components/Input";
import { getRequest, postRequest } from "@/ultis/helper";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import { getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function profile() {
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState({});
  const { authUser, setAuthUser } = useAuth();
  const router = useRouter();

  const onFormSubmit = async (event) => {
    event.preventDefault();

    await postRequest({
      url: "http://localhost:9000/api/v1/user/update",
      body: formData,
      token: authUser?.token,
      handleError: function (error) {
        setFormError(error);
      },
      handleSuccess: function () {
        setCookie('name', formData.name)
        setAuthUser( {...authUser, name: formData.name});
      },
    });
  };

  const onDelete = async (event) => {
    event.preventDefault();

    await postRequest({
      url: "http://localhost:9000/api/v1/user/delete",
      token: authUser?.token ,
      handleError: function (error) {
        setFormError(error);
      },
      handleSuccess: function () {
        router.push("/");
      },
    });
  };

  useEffect(() => {
    if(!authUser.token) return;
    getRequest({
      url: `http://localhost:9000/api/v1/user`,
      token: authUser?.token,
      handleSuccess: function (data) {
        setFormData({
          name: data.name,
          email: data.email,
        });
      },
    });
  }, [authUser.token]);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <Wrapper>
      <div className="min-h-screen flex items-center justify-center w-full ">
        <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-900">
            Profile
          </h1>
          <form onSubmit={onFormSubmit}>
            <Input
              type="text"
              title="Your name"
              name="name"
              placeholder={formData.name ?? "Your@email.com"}
              onChange={handleInputChange}
              errors={formError}
            />
            <Input
              type="email"
              title="Email Address"
              name="email"
              placeholder={formData.email ?? "Your@email.com"}
              onChange={handleInputChange}
              errors={formError}
            />
            <p className="text-gray-900 text-sm pt-2"></p>
            <div className="flex justify-between">
            <button
              className="w-1/2 mr-2 flex mt-4 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={onDelete}
            >
              Delete
            </button>
            <button
              type="submit"
              className="w-1/2 flex mt-4 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update
            </button>
            </div>
          </form>
        </div>
      </div>
    </Wrapper>
  );
}
