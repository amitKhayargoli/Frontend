import React, { useEffect, useState } from "react";
import { api } from "../../api";
import axios from "axios";
import ReusableBlogForm from "./ReusableBlogForm";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateBlog = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  const getBlogById = async (id) =>
    api.getBlogById(id).then((response) => {
      setTitle(response.title);
      setContent(response.content);
      setCategory(response.category);
      console.log(response);
    });

  useEffect(() => {
    getBlogById(id);
  }, []);
  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";

      const token = localStorage.getItem("token");
      if (selectedFile) {
        const data = new FormData();
        data.append("file", selectedFile);

        const uploadResponse = await axios.post(
          "http://localhost:5000/api/file/upload",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Upload Response:", uploadResponse.data);
        imageUrl = "http://localhost:5000/" + uploadResponse.data.file.path;

        if (!imageUrl) {
          throw new Error("File URL is missing from response");
        }
      }

      await api.updateBlog(id, { title, content, category, imageUrl });

      toast.success("Blog updated successfully");
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  return (
    <ReusableBlogForm
      method={handleUpdateBlog}
      heading="Update a blog"
      btnText="Update blog"
      title={title}
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      category={category}
      setCategory={setCategory}
      selectedFile={selectedFile}
      setSelectedFile={setSelectedFile}
    />
  );
};

export default UpdateBlog;
