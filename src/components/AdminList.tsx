import React, { useState } from "react";
import { CATEGORIES, PostProps } from "./PostList";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";

interface CSVInterface {
  email: string;
  content: string;
}

const AdminList = () => {
  const [category, setCategory] = useState<string>("1월");
  const [posts, setPosts] = useState<PostProps[]>([]);

  const getMonthlyPosts = async () => {
    setPosts([]);
    let postsRef = collection(db, "posts");
    const postsQuery = query(
      postsRef,
      where("category", "==", category),
      orderBy("createdAt", "asc")
    );
    const datas = await getDocs(postsQuery);
    datas?.forEach((doc) => {
      const dataObj = { ...doc.data(), id: doc.id };
      setPosts((prev) => [...prev, dataObj as PostProps]);
    });
    return datas;
  };

  const convertToCSV = (data: any) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "\uFEFF" +
      Object.keys(data[0]).join(",") +
      "\n" +
      data.map((row: any) => Object.values(row).join(",")).join("\n");

    data.forEach((a: any) => console.log(a));
    return encodeURI(csvContent);
  };

  const handleCSVDownload = () => {
    if (posts.length !== 0) {
      const trimmedData = posts.map((post) => {
        const temp = post?.comments;
        const item = temp?.map((comment) => {
          const email = comment.email;
          const content = comment.content;
          return { email, content };
        });
        return item;
      });
      console.log(trimmedData);

      const csvContent = convertToCSV(trimmedData);
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "data.csv");
      document.body.appendChild(link);
      link.click();
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "category") setCategory(value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await getMonthlyPosts();
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form__block">
        <label htmlFor="category">{"몇월 생의 정보를 가져오시겠어요?"}</label>
        <select
          name="category"
          id="category"
          onChange={onChange}
          defaultValue={category}
        >
          <option value="">카테고리를 선택해주세요</option>
          {CATEGORIES?.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="form__block">
        <input
          type="submit"
          value={"가져오기"}
          style={{ width: "50%", height: "50px" }}
        />
      </div>
      {posts && <button onClick={handleCSVDownload}>데이터 다운로드</button>}
    </form>
  );
};

export default AdminList;
