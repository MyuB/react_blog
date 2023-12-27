import Carousel from "components/Carousel";
import PostList from "components/PostList";
import Footer from "components/Layout/Footer";
import Header from "components/Layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <Carousel />
      <PostList />
      <Footer />
    </>
  );
}
