"use client";
import Wrapper from "@/components/Wrapper";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/Contexts/AuthContext";
import { getRequest, postRequest } from "@/ultis/helper";
import { getCookie } from "cookies-next";
import Paginate from "@/components/Paginate";
import Link from "next/link";

export default function Task() {
  const { authUser, setAuthUser } = useAuth();
  const [pageinData, setPaginData] = useState();
  const [page, setPage] = useState(1);
  const [tasks, setTasks] = useState({});
  const [refresh, setRefresh] = useState(null);

  useEffect(() => {
    if(!authUser.token) return;
    getRequest({
      url: `http://localhost:9000/api/v1/tasks?page=${page ?? 1}`,
      token: authUser?.token,
      handleError: function (error) {
        console.log(error);
      },
      handleSuccess: function (data) {
        setTasks({ ...data?.data });
        setPaginData(data);
      },
    });
  }, [page, refresh, authUser.token]);

  const handleDeleteTask = (id, cat) => {
    
    postRequest({
      url: `http://localhost:9000/api/v1/tasks/${id}/delete`,
      token: authUser?.token,
      handleError: function (error) {},
      handleSuccess: function (data) {
        setRefresh(new Date())
      },
    });
  };

  return (
    <Wrapper>
      <div className="min-w-96 min-h-[calc(100vh - 4rem)] max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl text-gray-900 font-medium">Tasks list</h1>
          </div>
          <div className="inline-flex space-x-2 items-center">
            <Link
              href="/tasks/create"
              className="p-2 border border-slate-200 rounded-md inline-flex space-x-1 items-center text-indigo-200 hover:text-white bg-indigo-600 hover:bg-indigo-500"
            >
              <span className="text-sm font-medium hidden md:block">
                Create
              </span>
            </Link>
          </div>
        </div>

        {tasks
          ? Object.keys(tasks).map((name, i) => {
              return (
                <div className="my-5" key={i}>
                  <p className="text-slate-800 font-bold">
                    {name ? name : "Uncategoried"}
                  </p>
                  {tasks[name].map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b border-slate-200 py-3 px-2 border-l-4  border-l-transparent"
                      >
                        <Link
                          href={`/tasks/${item.id}/update`}
                          className="w-full space-x-2"
                        >
                          <div className="text-slate-500">{item.title}</div>
                        </Link>
                        <div onClick={() => handleDeleteTask(item.id, item)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-4 h-4 text-slate-500 hover:text-slate-700 hover:cursor-pointer"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          : ""}
        <Paginate page={page} setPage={setPage} data={pageinData} />
      </div>
    </Wrapper>
  );
}
