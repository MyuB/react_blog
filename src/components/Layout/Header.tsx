import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "context/AuthContext";

export default function Header() {
  const { user } = useContext(AuthContext);

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        {"Infotainment Centre Cyber Rolling Paper"}
      </Link>
      <div>
        <Link to="/posts/new">글쓰기</Link>
        <Link to="/posts">게시글</Link>
        <Link to="/profile">프로필</Link>
        {user?.email === "info_admin@hyundai.com" ? (
          <Link to="/admin">Admin</Link>
        ) : (
          <></>
        )}
      </div>
    </header>
  );
}
