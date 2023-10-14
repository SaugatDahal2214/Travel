import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

export default function useFetchPosts() {
  const [postData, setPostData] = useState({
    isLoading: false,
    posts: [],
    status: null,
    serverError: null,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setPostData((prevData) => ({ ...prevData, isLoading: true }));

        const response = await axios.get("/api/posts");
        const { data, status } = response;

        if (status === 200) {
          setPostData({
            isLoading: false,
            posts: data,
            status: status,
            serverError: null,
          });
        }
      } catch (error) {
        setPostData((prevData) => ({
          ...prevData,
          isLoading: false,
          serverError: error,
        }));
      }
    };

    fetchPosts();
  }, []);

  return postData;
}
