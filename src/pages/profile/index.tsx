import Footer from "components/Layout/Footer";
import Header from "components/Layout/Header";
import PostList from "components/PostList";
import Profile from "components/Profile";

export default function ProfilePage() {
  return (
    <>
      <Header />
      <Profile />
      <PostList hasNavigation={false} />
      <Footer />
    </>
  );
}
