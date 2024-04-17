"use client";
import Wrapper from "@/components/Wrapper";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import { getRequest, postRequest } from "@/ultis/helper";
import { getCookie } from "cookies-next";
import Link from "next/link";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";

export default function UpdateTask({params}) {
  const { authUser } = useAuth();
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState({});
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const categoryRef = useRef(false);
  const refreshCate = useRef(null);

  useEffect(() => {
    if(!authUser.token) return;
    getRequest({
      url: `http://localhost:9000/api/v1/categories`,
      token: authUser?.token,
      handleSuccess: function (data) {
        setCategories(data);
      },
    });

  }, [refreshCate.value, authUser.token]);

  useEffect(() => {
    if(!authUser.token) return;
    getRequest({
      url: `http://localhost:9000/api/v1/tasks/${params?.id}`,
      token: authUser?.token,
      handleSuccess: function (data) {
        setFormData(data)
      },
    });

  }, [authUser.token]);

  const handleSubmit = () => {
    
    postRequest({
      url: `http://localhost:9000/api/v1/tasks/${params?.id}/edit`,
      token: authUser?.token,
      body: formData,
      handleError: function (error) {
        setFormError(error);
      },
      handleSuccess: function () {
        router.push("/tasks")
      },
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCateoryInput = (event) => {
    categoryRef.value = event?.target.value;
  };

  const handleCreateCategory = () => {
    
    postRequest({
      url: `http://localhost:9000/api/v1/categories/create`,
      token: authUser?.token,
      body: { name: categoryRef.value },
      handleSuccess: function () {
        refreshCate.value = new Date();
        setIsShow(false);
      },
    });
  };

  return (
    <Wrapper>
      <div className="min-w-96 min-h-[calc(100vh - 4rem)] mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl text-gray-900 font-medium">Update Task</h1>
          </div>
          <div className="inline-flex space-x-2 items-center">
            <Link
              href="/tasks"
              className="p-2 border border-slate-200 rounded-md inline-flex space-x-1 items-center text-indigo-200 hover:text-white bg-indigo-600 hover:bg-indigo-500"
            >
              <span className="text-sm font-medium hidden md:block">Back</span>
            </Link>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full flex mb-4 justify-between">
            {isShow ? (
              <input
                className="mr-2 shadow-sm text-gray-900 rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleCateoryInput}
              />
            ) : (
              <select className="w-3/4 border border-1" name="categories_id" onChange={handleInputChange} value={formData.categories_id}>
                  <option value={null} >Uncategoried</option>
                {categories?.length
                  ? categories.map((item, index) => {
                      return (
                        <option key={index} value={item.id} >
                          {item.name}
                        </option>
                      );
                    })
                  : ""}
              </select>
            )}
            {!isShow ? (
              <button
                className="p-2 px-4 border border-slate-200 rounded-md inline-flex space-x-1 items-center text-indigo-200 hover:text-white bg-indigo-600 hover:bg-indigo-500"
                onClick={() => setIsShow(true)}
              >
                Add
              </button>
            ) : (
              <>
                <button
                  className="p-2 border border-slate-200 rounded-md inline-flex space-x-1 items-center text-indigo-200 hover:text-white bg-indigo-600 hover:bg-indigo-500"
                  onClick={handleCreateCategory}
                >
                  Add
                </button>

                <button
                  className="p-2 border border-slate-200 rounded-md inline-flex space-x-1 items-center text-indigo-200 hover:text-white bg-indigo-600 hover:bg-indigo-500"
                  onClick={() => setIsShow(false)}
                >
                  Cancle
                </button>
              </>
            )}
          </div>
          <Input
            type="text"
            title="Task Tilte"
            name="title"
            placeholder={formData.title ?? ''}
            onChange={handleInputChange}
            errors={formError}
          />
          <Input
            type="text"
            title="Task Body"
            name="body"
            placeholder={formData.body ?? ''}
            onChange={handleInputChange}
            errors={formError}
          />
        </div>
        <div className="flex justify-center">
          <button
            className="p-2 mx-auto border border-slate-200 rounded-md inline-flex space-x-1 items-center text-indigo-200 hover:text-white bg-indigo-600 hover:bg-indigo-500"
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </Wrapper>
  );
}
