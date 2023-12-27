import Footer from "components/Layout/Footer";
import Header from "components/Layout/Header";
import PostList from "components/PostList";

export default function PostPage() {
  return (
    <>
      <Header />
      <PostList hasNavigation={false} />
      <Footer />
    </>
  );
}
