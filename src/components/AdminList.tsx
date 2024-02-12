import React, { useState } from "react";
import { CATEGORIES, PostProps } from "./PostList";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

interface XLSXInterface {
  for: string;
  writer: string;
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

    try {
      const datas = await getDocs(postsQuery);
      datas?.forEach((doc) => {
        const dataObj = { ...doc.data(), id: doc.id };
        setPosts((prev) => [...prev, dataObj as PostProps]);
      });
      toast.success("성공적으로 데이터를 불러왔습니다.");
    } catch (e) {
      toast.error("문제가 발생했습니다");
    }
  };

  const exportToExcel = (data: XLSXInterface[]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    console.log(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "data.xlsx");
  };

  const handleCSVDownload = () => {
    if (posts.length !== 0) {
      const flattenedData: XLSXInterface[] = [];
      posts.forEach((post) => {
        const tempTitle = post?.title;
        const comments = post?.comments;
        comments?.forEach((data) => {
          const parsedData = {
            for: tempTitle,
            writer: data.email,
            content: data.content,
          };
          flattenedData.push(parsedData);
        });
      });

      exportToExcel(flattenedData);
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
          style={{ width: "50%", height: "50px" }}
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
          value={"DB에서 데이터 가져오기"}
          style={{ width: "50%", height: "50px" }}
        />
      </div>
      {posts.length !== 0 && (
        <div className="form__block">
          <input
            type="submit"
            onClick={handleCSVDownload}
            value="Excel로 내보내기"
            style={{ width: "50%", height: "50px" }}
          />
        </div>
      )}
    </form>
  );
};

export default AdminList;
